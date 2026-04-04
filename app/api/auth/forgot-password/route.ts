import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { normalizeEmail } from '@/lib/auth-utils';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email } = body as Record<string, unknown>;
  if (typeof email !== 'string' || !email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const normalized = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  // Always return success to avoid leaking which emails are registered
  if (!user || !user.passwordHash) {
    return NextResponse.json({ success: true });
  }

  // Delete any existing reset token for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expires },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(normalized, resetUrl);
  } catch (err) {
    console.error('[forgot-password] Failed to send email:', err);
    // Still return success — token is saved and the user can try again
  }

  return NextResponse.json({ success: true });
}
