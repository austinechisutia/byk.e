import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ checkoutRequestId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { checkoutRequestId } = await params;

  const order = await prisma.order.findFirst({
    where: {
      mpesaCheckoutRequestId: checkoutRequestId,
      userId: session.user.id,
    },
    select: { status: true, id: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  return NextResponse.json({ status: order.status, orderId: order.id });
}
