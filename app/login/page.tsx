import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import AuthPageForm from '@/components/auth/AuthPageForm';
import { authOptions } from '@/lib/auth';
import { getSafeCallbackPath } from '@/lib/auth-utils';

interface LoginPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = getSafeCallbackPath(resolvedSearchParams?.callbackUrl);
  const error = resolvedSearchParams?.error;

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f0e8] pt-28 text-[#171717]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(228,243,134,0.55),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(17,67,15,0.14),_transparent_32%),linear-gradient(135deg,_#f8f5ef_0%,_#efe6d6_100%)]" />
      <div className="absolute inset-x-0 top-16 mx-auto h-72 w-72 rounded-full bg-white/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl gap-10 px-6 pb-16 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="max-w-xl pt-8 lg:pt-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-[#11430F]/70">
            Vigne Account
          </p>
          <h1 className="font-serif text-5xl leading-tight text-[#11430F] md:text-7xl">
            Bikes and gear for the road ahead.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-gray-700 md:text-lg">
            Sign in to save your favourites, track orders, and shop electric bikes, bicycles, parts, and ride accessories.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-gray-700 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-sm">
              <p className="font-semibold text-[#11430F]">Natural finish</p>
              <p className="mt-2 leading-6">Every piece is shaped from sustainably sourced materials with a minimal footprint.</p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-sm">
              <p className="font-semibold text-[#11430F]">Built to last</p>
              <p className="mt-2 leading-6">Designed to endure evolving meals and everyday life — not to be replaced each season.</p>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-sm">
              <p className="font-semibold text-[#11430F]">96% eco-conscious</p>
              <p className="mt-2 leading-6">Our range is made with materials that are kind to your kitchen and the planet.</p>
            </div>
          </div>
        </section>

        <div className="flex justify-center lg:justify-end">
          <Suspense fallback={<div className="w-full max-w-md h-96 rounded-[2rem] bg-white/40 animate-pulse" />}>
            <AuthPageForm callbackUrl={callbackUrl} oauthError={error} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}