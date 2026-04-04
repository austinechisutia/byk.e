'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { clampCartQuantity, type CartItem, type Product } from '@/lib/cart';

const PENDING_CART_ITEM_KEY = 'vigne_pending_cart_item';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  isCartSyncing: boolean;
  addToCart: (product: Product) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  toggleCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartSyncing, setIsCartSyncing] = useState(false);
  const cartItemsRef = useRef<CartItem[]>([]);
  const hasProcessedPendingItemRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  const buildNextCartItems = useCallback((currentItems: CartItem[], product: Product) => {
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (existingItem) {
      return currentItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: clampCartQuantity(item.quantity + 1) }
          : item,
      );
    }

    return [...currentItems, { ...product, quantity: 1 }];
  }, []);

  const storePendingCartItem = useCallback((product: Product) => {
    sessionStorage.setItem(PENDING_CART_ITEM_KEY, JSON.stringify(product));
  }, []);

  const readPendingCartItem = useCallback(() => {
    const rawValue = sessionStorage.getItem(PENDING_CART_ITEM_KEY);
    if (!rawValue) {
      return null;
    }

    try {
      const value = JSON.parse(rawValue) as Product;
      if (
        typeof value.id !== 'number' ||
        typeof value.name !== 'string' ||
        typeof value.price !== 'string' ||
        typeof value.image !== 'string'
      ) {
        sessionStorage.removeItem(PENDING_CART_ITEM_KEY);
        return null;
      }

      return value;
    } catch {
      sessionStorage.removeItem(PENDING_CART_ITEM_KEY);
      return null;
    }
  }, []);

  const clearPendingCartItem = useCallback(() => {
    sessionStorage.removeItem(PENDING_CART_ITEM_KEY);
  }, []);

  const redirectToLogin = useCallback((product?: Product) => {
    if (product) {
      storePendingCartItem(product);
    }

    setIsCartOpen(false);
    router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`);
    return false;
  }, [pathname, router, storePendingCartItem]);

  const persistCart = useCallback(async (nextItems: CartItem[]) => {
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: nextItems }),
    });

    if (response.status === 401) {
      redirectToLogin();
      throw new Error('Authentication required.');
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? 'Failed to update cart.');
    }

    const payload = (await response.json()) as { items?: CartItem[] };
    const savedItems = payload.items ?? [];
    setCartItems(savedItems);
    return savedItems;
  }, [redirectToLogin]);

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      if (status === 'loading') {
        return;
      }

      if (status !== 'authenticated' || !session?.user?.id) {
        if (isMounted) {
          setCartItems([]);
          setIsCartOpen(false);
        }
        return;
      }

      try {
        setIsCartSyncing(true);
        const response = await fetch('/api/cart', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error('Failed to load cart.');
        }

        const payload = (await response.json()) as { items?: CartItem[] };

        if (isMounted) {
          const nextItems = payload.items ?? [];
          setCartItems(nextItems);
          cartItemsRef.current = nextItems;
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setCartItems([]);
          cartItemsRef.current = [];
        }
      } finally {
        if (isMounted) {
          setIsCartSyncing(false);
        }
      }
    }

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, status]);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id || isCartSyncing || hasProcessedPendingItemRef.current) {
      return;
    }

    const pendingProduct = readPendingCartItem();

    if (!pendingProduct) {
      hasProcessedPendingItemRef.current = true;
      return;
    }

    hasProcessedPendingItemRef.current = true;
    setIsCartSyncing(true);

    void persistCart(buildNextCartItems(cartItemsRef.current, pendingProduct))
      .then(() => {
        clearPendingCartItem();
        setIsCartOpen(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsCartSyncing(false);
      });
  }, [buildNextCartItems, clearPendingCartItem, isCartSyncing, persistCart, readPendingCartItem, session?.user?.id, status]);

  useEffect(() => {
    if (status !== 'authenticated') {
      hasProcessedPendingItemRef.current = false;
    }
  }, [status]);

  const addToCart = async (product: Product) => {
    if (status !== 'authenticated' || !session?.user?.id) {
      return redirectToLogin(product);
    }

    setIsCartSyncing(true);

    try {
      const nextItems = buildNextCartItems(cartItemsRef.current, product);

      await persistCart(nextItems);
      setIsCartOpen(true);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsCartSyncing(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (status !== 'authenticated' || !session?.user?.id) {
      redirectToLogin();
      return;
    }

    setIsCartSyncing(true);

    try {
      await persistCart(cartItems.filter((item) => item.id !== productId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsCartSyncing(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (status !== 'authenticated' || !session?.user?.id) {
      redirectToLogin();
      return;
    }

    setIsCartSyncing(true);

    try {
      await persistCart(
        cartItems.map((item) =>
          item.id === productId ? { ...item, quantity: clampCartQuantity(quantity) } : item,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsCartSyncing(false);
    }
  };

  const clearCart = async () => {
    setIsCartSyncing(true);
    try {
      await persistCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCartSyncing(false);
    }
  };

  const toggleCart = () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      redirectToLogin();
      return;
    }

    setIsCartOpen((prev) => !prev);
  };

  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
  [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
      return total + (priceNum * item.quantity);
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        cartTotal, 
        isCartOpen, 
        isCartSyncing,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        toggleCart,
        setIsCartOpen,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
