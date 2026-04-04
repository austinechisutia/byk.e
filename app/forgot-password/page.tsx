'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f0e8] pt-28 text-[#171717]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(228,243,134,0.55),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(17,67,15,0.14),_transparent_32%),linear-gradient(135deg,_#f8f5ef_0%,_#efe6d6_100%)]" />
      <div className="absolute inset-x-0 top-16 mx-auto h-72 w-72 rounded-full bg-white/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-md items-center justify-center px-6 pb-16">
        <section className="w-full rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#11430F]/70">
            Vigne Account
          </p>
          <h1 className="font-serif text-3xl text-[#11430F] mb-2">Forgot password?</h1>

          {submitted ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-6 text-gray-600">
                If an account with that email exists, we&apos;ve sent a reset link. Check your inbox — it expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="block text-center w-full rounded-2xl bg-[#11430F] px-4 py-3 text-sm font-semibold text-[#e4f386] transition hover:opacity-90"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm leading-6 text-gray-600">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#11430F] focus:ring-2 focus:ring-[#e4f386]"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl bg-[#11430F] px-4 py-3 text-sm font-semibold text-[#e4f386] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-5 text-sm text-gray-600">
                Remember it?{' '}
                <Link href="/login" className="font-semibold text-[#11430F] hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
