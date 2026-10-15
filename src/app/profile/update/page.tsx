'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/Button';
import { useSession, updateUser, signOut } from '@/lib/auth-client';

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/signin');
    }
  }, [session, isPending, router]);

  const currentName = name || session?.user?.name || '';
  const avatarText = currentName ? currentName.charAt(0).toUpperCase() : 'U';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentName.trim()) {
      toast.error('নাম আবশ্যক');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updateUser({
        name: currentName.trim(),
      });

      if (error) {
        toast.error(error.message || 'আপডেটে সমস্যা হয়েছে।');
      } else {
        toast.success('নাম সফলভাবে আপডেট হয়েছে!');
        router.refresh();
      }
    } catch {
      toast.error('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      toast.success('লগআউট সফল হয়েছে');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('লগআউট করতে সমস্যা হয়েছে');
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] bg-[#f3f3f1] px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-[22px] border border-[#e5e5e5] bg-white p-6 shadow-[0_1px_0_rgba(17,17,17,0.03)]">
          <div className="animate-pulse space-y-6">
            <div className="h-14 w-14 rounded-full bg-gray-200" />
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-56 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#f3f3f1] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[22px] border border-[#e5e5e5] bg-[#f7f7f5] p-4 shadow-[0_1px_0_rgba(17,17,17,0.03)] sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e1e1e] text-xl font-bold text-white shadow-inner">
              {avatarText}
            </div>
            <div>
              <h1 className="text-[clamp(1.4rem,2vw,2rem)] font-bold text-[#111111] leading-none">
                {session?.user?.name || 'আমার প্রোফাইল'}
              </h1>
              <p className="mt-1 text-sm text-[#5b5b5b]">{session?.user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            loading={signingOut}
            className="h-11 rounded-xl border border-red-200 bg-transparent text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            ↩ সাইন আউট
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-[1.3rem] font-semibold text-[#111111]">তথ্য</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#2d2d2d]">
                নাম
              </label>
              <input
                id="name"
                type="text"
                value={currentName}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#d9d9d6] bg-white px-3 text-base text-[#111111] outline-none transition focus:border-[#2d8c6f] focus:ring-2 focus:ring-[#2d8c6f]/20"
                placeholder="আপনার নতুন নাম"
                disabled={loading}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#1ea66a] text-base font-semibold text-white hover:bg-[#1a9d62]"
              loading={loading}
            >
              আপডেট করুন
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
