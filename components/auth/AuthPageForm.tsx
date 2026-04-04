'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  AUTH_NAME_MAX_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
} from '@/lib/auth-utils';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthCallback: 'Google sign-in failed. Please try again.',
  OAuthSignin: 'Could not start Google sign-in. Please try again.',
  OAuthCreateAccount: 'Could not create account with Google. Please try again.',
  OAuthAccountNotLinked: 'This email is already registered with a password. Please sign in with your email instead.',
  Callback: 'Authentication callback failed. Please try again.',
  Default: 'An authentication error occurred. Please try again.',
};

function resolveOAuthError(error?: string) {
  if (!error) return '';
  return OAUTH_ERROR_MESSAGES[error] ?? OAUTH_ERROR_MESSAGES.Default;
}

interface AuthPageFormProps {
  callbackUrl: string;
  oauthError?: string;
}

type Mode = 'signin' | 'signup';

export default function AuthPageForm({ callbackUrl, oauthError }: AuthPageFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(() => resolveOAuthError(oauthError));
  const [isLoading, setIsLoading] = useState(false);

  const submitLabel = mode === 'signin' ? 'Sign In' : 'Create Account';

  const resetErrors = () => {
    if (error) {
      setError('');
    }
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setPassword('');
    resetErrors();
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    resetErrors();

    await signIn('google', { callbackUrl });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetErrors();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          setError(payload.error ?? 'Could not create account.');
          return;
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setError(result?.error ?? 'Invalid email or password.');
        return;
      }

      router.replace(result.url ?? callbackUrl);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#11430F]/70">
            Secure Access
          </p>
          <h1 className="font-serif text-3xl text-[#11430F] md:text-4xl">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-full border border-[#11430F]/15 px-3 py-1 text-sm font-medium text-[#11430F] transition hover:border-[#11430F]/30 hover:bg-[#11430F]/5"
        >
          Home
        </Link>
      </div>

      <p className="mb-6 text-sm leading-6 text-gray-600">
        Sign in with Google or use your email and password. Sessions are handled with signed JWTs.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path
            d="M21.805 10.023H12v3.955h5.617c-.242 1.273-.97 2.351-2.06 3.074v2.55h3.332c1.95-1.796 3.111-4.44 3.111-7.583 0-.664-.06-1.302-.195-1.996Z"
            fill="#4285F4"
          />
          <path
            d="M12 22c2.805 0 5.156-.93 6.889-2.398l-3.332-2.55c-.925.62-2.11.99-3.557.99-2.717 0-5.018-1.833-5.84-4.297H2.713v2.632A10.41 10.41 0 0 0 12 22Z"
            fill="#34A853"
          />
          <path
            d="M6.16 13.745A6.268 6.268 0 0 1 5.833 12c0-.61.113-1.2.327-1.745V7.623H2.713A10.41 10.41 0 0 0 1.583 12c0 1.675.402 3.26 1.13 4.377l3.447-2.632Z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.958c1.527 0 2.898.526 3.98 1.56l2.98-2.98C17.15 2.84 14.801 2 12 2 7.926 2 4.394 4.338 2.713 7.623l3.447 2.632c.822-2.464 3.123-4.297 5.84-4.297Z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">or</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={AUTH_NAME_MAX_LENGTH}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#11430F] focus:ring-2 focus:ring-[#e4f386]"
              placeholder="Your name"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#11430F] focus:ring-2 focus:ring-[#e4f386]"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={AUTH_PASSWORD_MIN_LENGTH}
            maxLength={AUTH_PASSWORD_MAX_LENGTH}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#11430F] focus:ring-2 focus:ring-[#e4f386]"
            placeholder={`Between ${AUTH_PASSWORD_MIN_LENGTH} and ${AUTH_PASSWORD_MAX_LENGTH} characters`}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-[#11430F] px-4 py-3 text-sm font-semibold text-[#e4f386] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Please wait...' : submitLabel}
        </button>
      </form>

      <div className="mt-5 text-sm text-gray-600">
        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
          className="font-semibold text-[#11430F] hover:underline"
        >
          {mode === 'signin' ? 'Create one' : 'Sign in'}
        </button>
      </div>
    </section>
  );
}