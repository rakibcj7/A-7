'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getBanglaDate } from '@/lib/date';
import { Button } from './Button';
import { useSession, signOut } from '@/lib/auth-client';
import toast from 'react-hot-toast';

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

const API_URL = 'https://openapi.programming-hero.com/api/bazardor';

const tickerItems = [
  { emoji: '🍚', name: 'স্বর্ণমাছি চাল', price: '১৪৮ টাকা/কেজি', change: '▲ ২.১%' },
  { emoji: '🫘', name: 'মসুর ডাল', price: '১২০ টাকা/কেজি', change: '▼ ১.৫%' },
  { emoji: '🥔', name: 'আলু', price: '৩৫ টাকা/কেজি', change: '— ০.০%' },
  { emoji: '🧅', name: 'পেঁয়াজ', price: '৮০ টাকা/কেজি', change: '▲ ৩.২%' },
  { emoji: '🌶️', name: 'মরিচ', price: '৩৫০ টাকা/কেজি', change: '▼ ০.৮%' },
  { emoji: '🐟', name: 'ইলিশ মাছ', price: '১,৮৫০ টাকা/কেজি', change: '▲ ১.২%' },
  { emoji: '🍗', name: 'ব্রয়লার মাংস', price: '১৮০ টাকা/কেজি', change: '— ০.০%' },
  { emoji: '🥚', name: 'কুকুর ডিম', price: '১২ টাকা/পিস', change: '▼ ১.০%' },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: sessionLoading } = useSession();
  const [banglaDate, setBanglaDate] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState(fallbackCategories);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('লগআউট সফল হয়েছে');
      setUserMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch {
      toast.error('লগআউট করতে সমস্যা হয়েছে');
    }
  };

  useEffect(() => {
    setBanglaDate(getBanglaDate());
    const interval = setInterval(() => setBanglaDate(getBanglaDate()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        // API returns a raw array, not { categories: [...] }
        const cats = Array.isArray(data) ? data : (data.categories || fallbackCategories);
        setCategories(cats.length > 0 ? cats : fallbackCategories);
      })
      .catch(() => setCategories(fallbackCategories));
  }, []);

  const isActive = (slug: string) => pathname === `/category/${slug}` || (slug === 'chal' && pathname === '/');

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Top Row - Logo & Date */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3" aria-label="বাজার দর - হোম">
            <span className="text-2xl">🛒</span>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">বাজার দর</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{banglaDate}</p>
            </div>
          </Link>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-2">
            {sessionLoading ? (
              <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-expanded={userMenuOpen}
                >
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                    {session.user.name ? session.user.name[0].toUpperCase() : '👤'}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user.name || 'ব্যবহারকারী'}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile/update"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      ✏️ প্রোফাইল আপডেট
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      🚪 লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">সাইন ইন</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">সাইন আপ</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="মেনু টগল করুন"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Category Navigation Row */}
      <nav className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" aria-label="ক্যাটেগরি নেভিগেশন">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 px-2 -mx-2" role="tablist">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.slug === 'chal' ? '/' : `/category/${cat.slug}`}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  isActive(cat.slug)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
                role="tab"
                aria-selected={isActive(cat.slug)}
                aria-controls={`panel-${cat.slug}`}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.nameBn}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-wrap gap-2" aria-label="মোবাইল ক্যাটেগরি">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.slug === 'chal' ? '/' : `/category/${cat.slug}`}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors',
                    isActive(cat.slug)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'
                  )}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  {cat.nameBn}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              {session?.user ? (
                <>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                  <Link href="/profile/update" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">✏️ প্রোফাইল আপডেট</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    🚪 লগআউট
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">সাইন ইন</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">সাইন আপ</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Ticker Marquee */}
      <div className="bg-primary/10 dark:bg-primary/20 border-t border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex animate-marquee" aria-live="polite" aria-label="দামের টিকর">
            {tickerItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 whitespace-nowrap shrink-0">
                <span className="text-lg">{item.emoji}</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                <span className="text-gray-600 dark:text-gray-300">{item.price}</span>
                <span className={cn(
                  'font-medium px-2 py-0.5 rounded text-sm',
                  item.change.startsWith('▲') ? 'text-green-600 bg-green-50 dark:bg-green-900/30' :
                  item.change.startsWith('▼') ? 'text-red-600 bg-red-50 dark:bg-red-900/30' :
                  'text-gray-500 bg-gray-100 dark:bg-gray-800'
                )}>
                  {item.change}
                </span>
                <span className="text-gray-300 dark:text-gray-600 mx-2">•</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {tickerItems.map((item, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-2 px-4 py-2 whitespace-nowrap shrink-0">
                <span className="text-lg">{item.emoji}</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                <span className="text-gray-600 dark:text-gray-300">{item.price}</span>
                <span className={cn(
                  'font-medium px-2 py-0.5 rounded text-sm',
                  item.change.startsWith('▲') ? 'text-green-600 bg-green-50 dark:bg-green-900/30' :
                  item.change.startsWith('▼') ? 'text-red-600 bg-red-50 dark:bg-red-900/30' :
                  'text-gray-500 bg-gray-100 dark:bg-gray-800'
                )}>
                  {item.change}
                </span>
                <span className="text-gray-300 dark:text-gray-600 mx-2">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}