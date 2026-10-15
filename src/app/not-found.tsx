'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="container py-20 md:py-32">
      <div className="max-w-md mx-auto text-center">
        <div className="text-9xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404 - পেজ পাওয়া যায়নি
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি বা অস্তিত্বে নেই।
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/')}>হোম পেজে ফিরে যান</Button>
          <Button variant="outline" onClick={() => router.push('/category/chal')}>চাল দেখুন</Button>
        </div>
      </div>
    </div>
  );
}