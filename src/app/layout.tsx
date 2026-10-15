import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'বাজার দর | BazarDor - প্রয়োজনীয় পণ্যের দাম এক নজরে',
  description: 'বাংলাদেশের বাজারের দাম আপডেট - চাল, ডাল, সবজি, মাছ, মাংস, ডিম, মশলা এবং তেলের আজকের দাম জানুন।',
  keywords: ['বাজার দর', 'BazarDor', 'পণ্যের দাম', 'বাংলাদেশ বাজার', 'দাম আপডেট'],
  authors: [{ name: 'BazarDor Team' }],
  openGraph: {
    title: 'বাজার দর | BazarDor',
    description: 'প্রয়োজনীয় পণ্যের দাম এক নজরে',
    type: 'website',
    locale: 'bn_BD',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
};

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
      <nav className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
            ))}
          </div>
        </div>
      </nav>
      <div className="bg-primary/10 dark:bg-primary/20 border-t border-gray-200 dark:border-gray-800 animate-pulse h-10" />
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '0.75rem',
              padding: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f9fafb',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f9fafb',
              },
            },
          }}
        />
      </body>
    </html>
  );
}