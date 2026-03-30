'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'signin' | 'signup';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const submitLabel = mode === 'signin' ? 'Sign In' : 'Create Account';

  const resetForm = () => {
    setError('');
    setPassword('');
    if (mode === 'signin') {
      setName('');
    }
  };

  const handleGoogle = async () => {
    setError('');
    await signIn('google', { callbackUrl: '/' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
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
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      onClose();
      resetForm();
      window.location.reload();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Close auth modal"
          >
            x
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Continue with Google or use your email and password.
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition inline-flex items-center justify-center gap-3"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
          >
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
          <span className="h-px bg-gray-200 flex-1" />
          <span className="text-xs uppercase tracking-wide text-gray-400">or</span>
          <span className="h-px bg-gray-200 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e4f386]"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e4f386]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e4f386]"
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#11430F] px-4 py-3 text-sm font-semibold text-[#e4f386] hover:opacity-90 transition disabled:opacity-50"
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
      </div>
    </div>
  );
}
