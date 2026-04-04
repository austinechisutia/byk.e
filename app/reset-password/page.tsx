'use client';

import { FormEvent, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AUTH_PASSWORD_MAX_LENGTH, AUTH_PASSWORD_MIN_LENGTH } from '@/lib/auth-utils';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-red-600">Invalid or missing reset link.</p>
        <Link href="/forgot-password" className="font-semibold text-[#11430F] text-sm hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? 'Something went wrong. Please try again.');
        return;
      }

      router.replace('/login?reset=success');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={AUTH_PASSWORD_MIN_LENGTH}
          maxLength={AUTH_PASSWORD_MAX_LENGTH}
          placeholder={`Between ${AUTH_PASSWORD_MIN_LENGTH} and ${AUTH_PASSWORD_MAX_LENGTH} characters`}
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#11430F] focus:ring-2 focus:ring-[#e4f386]"
        />
      </div>

      <div>
        <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          minLength={AUTH_PASSWORD_MIN_LENGTH}
          maxLength={AUTH_PASSWORD_MAX_LENGTH}
          placeholder="Repeat your new password"
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#11430F] focus:ring-2 focus:ring-[#e4f386]"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-[#11430F] px-4 py-3 text-sm font-semibold text-[#e4f386] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Saving…' : 'Set New Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f0e8] pt-28 text-[#171717]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(228,243,134,0.55),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(17,67,15,0.14),_transparent_32%),linear-gradient(135deg,_#f8f5ef_0%,_#efe6d6_100%)]" />
      <div className="absolute inset-x-0 top-16 mx-auto h-72 w-72 rounded-full bg-white/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-md items-center justify-center px-6 pb-16">
        <section className="w-full rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#11430F]/70">
            Vigne Account
          </p>
          <h1 className="font-serif text-3xl text-[#11430F] mb-2">Set new password</h1>
          <p className="mb-6 text-sm leading-6 text-gray-600">
            Choose a strong password for your Vigne account.
          </p>

          <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
