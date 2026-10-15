'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const API_URL = 'https://openapi.programming-hero.com/api/bazardor';

const fallbackCategories = [
  { id: 'chal', slug: 'chal', nameBn: 'চাল', icon: '🍚' },
  { id: 'dal', slug: 'dal', nameBn: 'ডাল', icon: '🫘' },
  { id: 'sobji', slug: 'sobji', nameBn: 'সবজি', icon: '🥬' },
  { id: 'mach', slug: 'mach', nameBn: 'মাছ', icon: '🐟' },
  { id: 'mangsho', slug: 'mangsho', nameBn: 'মাংস', icon: '🍗' },
  { id: 'dim-dui', slug: 'dim-dui', nameBn: 'ডিম-দুধ', icon: '🥛' },
  { id: 'mosla', slug: 'mosla', nameBn: 'মসলা', icon: '🌶️' },
  { id: 'tel', slug: 'tel', nameBn: 'তেল', icon: '🛢️' },
];

const CURRENT_YEAR = 2026;

export function Footer() {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const cats = Array.isArray(data) ? data : (data.categories || fallbackCategories);
        setCategories(cats.length > 0 ? cats : fallbackCategories);
      })
      .catch(() => setCategories(fallbackCategories));
  }, []);

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">বাজার দর</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                প্রয়োজনীয় পণ্যের দাম এক নজরে।
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-primary dark:hover:text-primary transition-colors">হোম</Link>
            {categories
              .filter(c => ['sobji', 'mach', 'mangsho', 'chal'].includes(c.slug))
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {cat.nameBn}
                </Link>
              ))}
          </nav>

          <div className="text-right md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।"
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              © {CURRENT_YEAR} বাজার দর। সকল অধিকার সংরক্ষিত।
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}