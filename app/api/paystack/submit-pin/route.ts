import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface PaystackChargeResponse {
  status: boolean;
  message: string;
  data: { status: string; reference: string; display_text?: string };
}

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

  const { pin, reference } = body as { pin: string; reference: string };

  if (typeof pin !== 'string' || !pin || typeof reference !== 'string' || !reference) {
    return NextResponse.json({ error: 'PIN and reference are required.' }, { status: 400 });
  }

  const paystackRes = await fetch('https://api.paystack.co/charge/submit_pin', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pin, reference }),
  });

  let data: PaystackChargeResponse;
  try {
    data = await paystackRes.json() as PaystackChargeResponse;
  } catch {
    return NextResponse.json({ error: 'Unexpected response from payment provider.' }, { status: 502 });
  }

  if (!paystackRes.ok || !data.status) {
    return NextResponse.json({ error: data.message || 'PIN verification failed. Please check your PIN and try again.' }, { status: 502 });
  }

  return NextResponse.json({
    status: data.data.status,
    reference: data.data.reference,
    displayText: data.data.display_text,
  });
}
