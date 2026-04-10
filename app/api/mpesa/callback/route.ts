import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface StkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
}

interface CallbackBody {
  Body: {
    stkCallback: StkCallback;
  };
}

export async function POST(request: NextRequest) {
  let body: CallbackBody;
  try {
    body = (await request.json()) as CallbackBody;
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid body.' });
  }

  const callback = body?.Body?.stkCallback;
  if (!callback?.CheckoutRequestID) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Missing callback data.' });
  }

  const { CheckoutRequestID, ResultCode } = callback;
  const newStatus = ResultCode === 0 ? 'paid' : 'failed';

  await prisma.order.updateMany({
    where: { mpesaCheckoutRequestId: CheckoutRequestID },
    data: { status: newStatus },
  });

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted.' });
}
