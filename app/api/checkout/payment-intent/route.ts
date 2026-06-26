import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

  const { amount, email } = body as Record<string, unknown>;

  if (typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
  }

  if (typeof email !== 'string' || !email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Paystack expects amount in kobo (smallest currency unit)
      currency: 'KES',
    }),
  });

  if (!paystackRes.ok) {
    return NextResponse.json({ error: 'Failed to initialize payment.' }, { status: 502 });
  }

  const paystackData = await paystackRes.json() as { data: { access_code: string; reference: string } };
  const { access_code, reference } = paystackData.data;

  return NextResponse.json({ accessCode: access_code, reference });
}
