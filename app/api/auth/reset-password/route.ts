import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { AUTH_PASSWORD_MAX_LENGTH, AUTH_PASSWORD_MIN_LENGTH } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { token, password } = body as Record<string, unknown>;

  if (typeof token !== 'string' || !token) {
    return NextResponse.json({ error: 'Invalid or missing token.' }, { status: 400 });
  }

  if (
    typeof password !== 'string' ||
    password.length < AUTH_PASSWORD_MIN_LENGTH ||
    password.length > AUTH_PASSWORD_MAX_LENGTH
  ) {
    return NextResponse.json(
      { error: `Password must be between ${AUTH_PASSWORD_MIN_LENGTH} and ${AUTH_PASSWORD_MAX_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: 'This reset link has expired or is invalid.' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
