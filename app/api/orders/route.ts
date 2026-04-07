import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const {
    email,
    firstName,
    lastName,
    address,
    city,
    postalCode,
    paymentMethod,
    subtotal,
    shipping,
    total,
    items,
    stripePaymentIntentId,
  } = body as Record<string, unknown>;

  if (
    typeof email !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof address !== 'string' ||
    typeof city !== 'string' ||
    typeof postalCode !== 'string' ||
    typeof paymentMethod !== 'string' ||
    typeof subtotal !== 'number' ||
    typeof shipping !== 'number' ||
    typeof total !== 'number' ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return NextResponse.json({ error: 'Missing or invalid order fields.' }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      email,
      firstName,
      lastName,
      address,
      city,
      postalCode,
      paymentMethod,
      subtotal,
      shipping,
      total,
      items: {
        create: (items as Array<Record<string, unknown>>).map((item) => ({
          productId: item.productId as number,
          name: item.name as string,
          price: item.price as string,
          image: item.image as string,
          category: (item.category as string | undefined) ?? null,
          quantity: item.quantity as number,
        })),
      },
    },
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}
