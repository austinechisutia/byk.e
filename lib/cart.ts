export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const MAX_CART_ITEM_QUANTITY = 99;
export const MAX_CART_ITEMS = 50;

export function clampCartQuantity(quantity: number) {
  return Math.max(1, Math.min(MAX_CART_ITEM_QUANTITY, quantity));
}

export function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.id === 'number' &&
    Number.isInteger(item.id) &&
    typeof item.name === 'string' &&
    item.name.length > 0 &&
    typeof item.price === 'string' &&
    item.price.length > 0 &&
    typeof item.image === 'string' &&
    item.image.length > 0 &&
    (typeof item.category === 'undefined' || typeof item.category === 'string') &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= MAX_CART_ITEM_QUANTITY
  );
}