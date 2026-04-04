import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import {
  AUTH_NAME_MAX_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  isValidEmail,
  normalizeEmail,
} from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const email = body.email ? normalizeEmail(body.email) : undefined;
    const password = body.password?.trim();
    const name = body.name?.trim() || null;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters.` },
        { status: 400 },
      );
    }

    if (password.length > AUTH_PASSWORD_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Password must be ${AUTH_PASSWORD_MAX_LENGTH} characters or fewer.` },
        { status: 400 },
      );
    }

    if (name && name.length > AUTH_NAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Name must be ${AUTH_NAME_MAX_LENGTH} characters or fewer.` },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create account.' },
      { status: 500 },
    );
  }
}
