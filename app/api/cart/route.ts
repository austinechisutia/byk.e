import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clampCartQuantity, isCartItem, MAX_CART_ITEMS, type CartItem } from '@/lib/cart';
import { prisma } from '@/lib/prisma';

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

function mapCartItems(items: Array<{
  productId: number;
  name: string;
  price: string;
  image: string;
  category: string | null;
  quantity: number;
}>): CartItem[] {
  return items.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category ?? undefined,
    quantity: item.quantity,
  }));
}

async function readCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return mapCartItems(cart?.items ?? []);
}

function normalizeCartItems(items: CartItem[]) {
  const dedupedItems = new Map<number, CartItem>();

  for (const item of items) {
    const existingItem = dedupedItems.get(item.id);

    if (existingItem) {
      dedupedItems.set(item.id, {
        ...existingItem,
        quantity: clampCartQuantity(existingItem.quantity + item.quantity),
      });
      continue;
    }

    dedupedItems.set(item.id, {
      ...item,
      quantity: clampCartQuantity(item.quantity),
    });
  }

  return Array.from(dedupedItems.values()).slice(0, MAX_CART_ITEMS);
}

export async function GET() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const items = await readCart(userId);
  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { items?: unknown };

    if (!Array.isArray(body.items) || body.items.length > MAX_CART_ITEMS) {
      return NextResponse.json({ error: 'Invalid cart payload.' }, { status: 400 });
    }

    if (!body.items.every(isCartItem)) {
      return NextResponse.json({ error: 'Invalid cart item.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Your session is no longer valid. Please sign in again.' }, { status: 401 });
    }

    const normalizedItems = normalizeCartItems(body.items);

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (normalizedItems.length > 0) {
      await prisma.cartItem.createMany({
        data: normalizedItems.map((item) => ({
          cartId: cart.id,
          productId: item.id,
          name: item.name.trim().slice(0, 120),
          price: item.price.trim().slice(0, 40),
          image: item.image.trim().slice(0, 255),
          category: item.category?.trim().slice(0, 80),
          quantity: clampCartQuantity(item.quantity),
        })),
      });
    }

    const items = await readCart(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Cart update failed:', error);

    const message = error instanceof Error ? error.message : 'Failed to save cart.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}