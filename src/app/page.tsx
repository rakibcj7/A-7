import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';
import { toBengaliDigits } from '@/types';

export const metadata: Metadata = {
  title: 'বাজার দর | BazarDor - প্রয়োজনীয় পণ্যের দাম এক নজরে',
  description: 'বাংলাদেশের বাজারের দাম আপডেট - চাল, ডাল, সবজি, মাছ, মাংস, ডিম, মশলা এবং তেলের আজকের দাম জানুন।',
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const risers = [...products]
    .filter(p => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = [...products]
    .filter(p => p.change < 0)
    .sort((a, b) => a.change - b.change)
            .slice(0, 6);

  void categories;

  return (
    <div className="container py-8">
      <section className="mb-12" aria-labelledby="hero-heading">
        <div className="grid lg:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-[28px] border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-4">
              <span>🛍️</span> {toBengaliDigits(products.length)}টি নিত্যদিনের পণ্য
            </div>    
                     <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight mb-4">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="text-base sm:text-lg text-[#374151] mb-6 max-w-xl leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <Link
              href="#সব-পণ্য"
              className="btn-primary text-base sm:text-lg px-8 shadow-sm hover:shadow-md transition-all"
            >
              সব পণ্য দেখুন →
                   </Link>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative w-64 h-56 sm:w-80 sm:h-72 lg:w-96 lg:h-80 flex items-center justify-center">
              <Image
                src="/images/bazar-hero.png"
                alt="বাজারের পণ্যের ঝুড়ি"
                width={360}
                height={300}
                priority
                className="object-contain drop-shadow-md animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="আজ-দাম-বেড়েছে" className="mb-10" aria-labelledby="risers-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="risers-heading" className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <span className="text-green-600">▲</span> আজ দাম বেড়েছে
          </h2>
        </div>
        {risers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list">
            {risers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductGridSkeleton count={6} />
          </div>
        )}
      </section>

      <section id="আজ-দাম-কমেছে" className="mb-10" aria-labelledby="fallers-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="fallers-heading" className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <span className="text-red-600">▼</span> আজ দাম কমেছে
          </h2>
        </div>
        {fallers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list">
            {fallers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductGridSkeleton count={6} />
          </div>
        )}
      </section>

      <section id="সব-পণ্য" aria-labelledby="all-products-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="all-products-heading" className="text-2xl font-bold text-[#111111]">সব পণ্য</h2>
          <p className="text-sm text-[#6B7280]">
            মোট {products.length} টি পণ্য
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}