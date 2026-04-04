import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import {
  AUTH_PASSWORD_MAX_LENGTH,
  DEFAULT_AUTH_REDIRECT,
  getSafeCallbackPath,
  normalizeEmail,
} from '@/lib/auth-utils';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required.');
        }

        if (credentials.password.length > AUTH_PASSWORD_MAX_LENGTH) {
          throw new Error('Invalid email or password.');
        }

        const user = await prisma.user.findUnique({
          where: { email: normalizeEmail(credentials.email) },
        });

        if (!user?.passwordHash) {
          throw new Error('Invalid email or password.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${getSafeCallbackPath(url)}`;
      }

      try {
        const target = new URL(url);
        if (target.origin === baseUrl) {
          return `${baseUrl}${getSafeCallbackPath(`${target.pathname}${target.search}${target.hash}`)}`;
        }
      } catch {
        return `${baseUrl}${DEFAULT_AUTH_REDIRECT}`;
      }

      return `${baseUrl}${DEFAULT_AUTH_REDIRECT}`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
