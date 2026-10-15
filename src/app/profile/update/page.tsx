'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/Button';
import { useSession, updateUser } from '@/lib/auth-client';

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/signin');
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('নাম আবশ্যক');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || 'আপডেটে সমস্যা হয়েছে।');
      } else {
        toast.success('নাম সফলভাবে আপডেট হয়েছে!');
        router.push('/');
        router.refresh();
      }
    } catch {
      toast.error('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="container py-12 md:py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">প্রোফাইল আপডেট</h1>
          <p className="text-gray-600 dark:text-gray-400">
            আপনার নাম আপডেট করুন
          </p>
          {session?.user?.email && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {session.user.email}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              নাম
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="আপনার নতুন নাম"
              disabled={loading}
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            আপডেট করুন
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline font-medium"
          >
            ← ফিরে যান
          </button>
        </p>
      </div>
    </div>
  );
}