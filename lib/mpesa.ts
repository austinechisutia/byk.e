// Safaricom Daraja API helpers

const DARAJA_BASE_URL =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

/** Get a short-lived OAuth access token */
export async function getMpesaAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const res = await fetch(
    `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      cache: 'no-store',
    }
  );

  const data = (await res.json()) as Record<string, unknown>;

  if (!res.ok || typeof data.access_token !== 'string' || !data.access_token) {
    throw new Error(
      `Daraja token request failed (${res.status}): ${JSON.stringify(data)}`
    );
  }

  return data.access_token;
}

/** Format a Kenyan phone number to the 2547XXXXXXXX format Daraja expects */
export function formatKenyanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  throw new Error('Invalid Kenyan phone number');
}

/** Build the base64 password and timestamp for STK push */
function buildPassword(): { password: string; timestamp: string } {
  const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14); // YYYYMMDDHHmmss
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
  return { password, timestamp };
}

export interface StkPushResult {
  checkoutRequestId: string;
  merchantRequestId: string;
}

/**
 * Initiate an STK Push (Lipa Na M-Pesa Online).
 * @param phone  Formatted phone number (2547XXXXXXXX)
 * @param amount Amount in KES (whole number)
 * @param accountRef Short reference shown on the user's phone (≤12 chars)
 */
export async function initiateStkPush(
  phone: string,
  amount: number,
  accountRef: string
): Promise<StkPushResult> {
  const accessToken = await getMpesaAccessToken();
  const { password, timestamp } = buildPassword();
  const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE!;
  const callbackUrl = process.env.MPESA_CALLBACK_URL!;

  const body = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: phone,
    PartyB: shortCode,
    PhoneNumber: phone,
    CallBackURL: callbackUrl,
    AccountReference: accountRef.slice(0, 12),
    TransactionDesc: 'Vigne Order Payment',
  };

  const res = await fetch(`${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as Record<string, unknown>;

  if (!res.ok || data.ResponseCode !== '0') {
    const desc =
      typeof data.ResponseDescription === 'string'
        ? data.ResponseDescription
        : JSON.stringify(data);
    throw new Error(`STK Push failed: ${desc}`);
  }

  return {
    checkoutRequestId: data.CheckoutRequestID as string,
    merchantRequestId: data.MerchantRequestID as string,
  };
}
