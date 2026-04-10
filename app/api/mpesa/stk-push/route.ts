import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { initiateStkPush, formatKenyanPhone } from '@/lib/mpesa';

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
    phone,
    email,
    firstName,
    lastName,
    address,
    city,
    postalCode,
    subtotal,
    shipping,
    total,
    items,
  } = body as Record<string, unknown>;

  if (
    typeof phone !== 'string' ||
    typeof email !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof address !== 'string' ||
    typeof city !== 'string' ||
    typeof postalCode !== 'string' ||
    typeof subtotal !== 'number' ||
    typeof shipping !== 'number' ||
    typeof total !== 'number' ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 });
  }

  let formattedPhone: string;
  try {
    formattedPhone = formatKenyanPhone(phone);
  } catch {
    return NextResponse.json({ error: 'Invalid Kenyan phone number. Use format 07XXXXXXXX or 01XXXXXXXX.' }, { status: 400 });
  }

  // Initiate STK Push first — only create the order record if Daraja accepts the request
  let checkoutRequestId: string;
  try {
    const result = await initiateStkPush(formattedPhone, total, 'Vigne');
    checkoutRequestId = result.checkoutRequestId;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'STK Push failed.';
    return NextResponse.json({ error: message }, { status: 502 });
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
      paymentMethod: 'mpesa',
      subtotal,
      shipping,
      total,
      status: 'pending_mpesa',
      mpesaCheckoutRequestId: checkoutRequestId,
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

  return NextResponse.json({ orderId: order.id, checkoutRequestId });
}
