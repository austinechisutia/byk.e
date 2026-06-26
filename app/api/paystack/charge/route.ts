import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface PaystackChargeResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    display_text?: string;
  };
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

  const { email, amount, card } = body as {
    email: string;
    amount: number;
    card: { number: string; cvv: string; expiry_month: string; expiry_year: string };
  };

  if (
    typeof email !== 'string' || !email ||
    typeof amount !== 'number' || amount <= 0 ||
    typeof card?.number !== 'string' || !card.number ||
    typeof card?.cvv !== 'string' || !card.cvv ||
    typeof card?.expiry_month !== 'string' || !card.expiry_month ||
    typeof card?.expiry_year !== 'string' || !card.expiry_year
  ) {
    return NextResponse.json({ error: 'Missing required payment fields.' }, { status: 400 });
  }

  const paystackRes = await fetch('https://api.paystack.co/charge', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Paystack expects amount in kobo
      card: {
        number: card.number.replace(/\s/g, ''),
        cvv: card.cvv,
        expiry_month: card.expiry_month,
        expiry_year: card.expiry_year,
      },
    }),
  });

  let data: PaystackChargeResponse;
  try {
    data = await paystackRes.json() as PaystackChargeResponse;
  } catch {
    return NextResponse.json({ error: 'Unexpected response from payment provider.' }, { status: 502 });
  }

  if (!paystackRes.ok || !data.status) {
    console.error('[Paystack charge error]', data.message, data);
    return NextResponse.json({ error: data.message || 'Payment failed. Please check your card details and try again.' }, { status: 502 });
  }

  return NextResponse.json({
    status: data.data.status,
    reference: data.data.reference,
    displayText: data.data.display_text,
  });
}
