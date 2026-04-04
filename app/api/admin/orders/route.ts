import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      user: {
        select: { id: true, name: true, email: true, image: true, createdAt: true },
      },
    },
  });

  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { orderId, status } = body as Record<string, unknown>;

  const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (typeof orderId !== 'string' || typeof status !== 'string' || !allowed.includes(status)) {
    return NextResponse.json({ error: 'Invalid orderId or status.' }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json({ order });
}
