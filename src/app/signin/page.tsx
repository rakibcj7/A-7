'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/Button';
import { signIn } from '@/lib/auth-client';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);

  useEffect(() => {
    const justRegistered = searchParams.get('registered');
    const protectedRedirect = searchParams.get('reason');

    if (justRegistered === 'true') {
      toast.success('একাউন্ট তৈরি হয়েছে। এখন লগইন করুন।');
    }

    if (protectedRedirect === 'required') {
      toast.error('দয়া করে লগইন করুন।');
    }
  }, [searchParams]);

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('ইমেইল এবং পাসওয়ার্ড পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
        callbackURL: callbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error.message || 'লগইন করতে সমস্যা হয়েছে।');
      }

      toast.success('সফলভাবে লগইন হয়েছে।');
      router.push(callbackUrl || '/');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ইমেইল দিয়ে লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider);
      await signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch {
      toast.error(`${provider === 'google' ? 'Google' : 'GitHub'} দিয়ে সাইন ইন করতে সমস্যা হয়েছে।`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 inline-block">🛒</span>
          <h1 className="text-2xl font-bold text-[#111111] mb-2">
            বাজার দর এ সাইন ইন করুন
          </h1>
          <p className="text-sm text-[#4B5563]">
            আপনার ইমেইল, Google অথবা GitHub একাউন্ট দিয়ে প্রবেশ করুন
          </p>
        </div>

                 <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-1.5">
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
                   value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            লগইন
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
            <span className="bg-white px-3">অথবা</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium flex items-center justify-center gap-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleSocialLogin('google')}
            disabled={loadingProvider !== null}
            loading={loadingProvider === 'google'}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google দিয়ে সাইন ইন
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium flex items-center justify-center gap-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => handleSocialLogin('github')}
            disabled={loadingProvider !== null}
            loading={loadingProvider === 'github'}
          >
            <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub দিয়ে সাইন ইন
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#F1F5F9] text-center">
          <p className="text-sm text-[#4B5563]">
            একাউন্ট নেই?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              রেজিস্টার করুন
            </Link>
          </p>
          <div className="mt-4">
            <Link href="/" className="text-sm text-primary hover:underline font-medium">
              ← হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center animate-pulse">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}