import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/api';
import { toBengaliDigits } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/Button';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return {
    title: `${product?.name || 'পণ্য'} | বাজার দর`,
    description: `${product?.name || 'পণ্য'} এর বিস্তারিত দাম তথ্য, বাজারভিত্তিক দাম এবং পরিসংখ্যান।`,
  };
}

function formatPrice(price: number): string {
  return toBengaliDigits(price.toLocaleString('bn-BD'));
}

function getChangeBadge(change: number) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const absChange = Math.abs(change).toFixed(1);
  
  if (isPositive) return { label: `▲ ${absChange}%`, className: 'badge-success' };
  if (isNegative) return { label: `▼ ${absChange}%`, className: 'badge-error' };
  return { label: `— ${absChange}%`, className: 'badge-neutral' };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const changeBadge = getChangeBadge(product.change);

  // Use the real market data from the API
  const marketPrices = product.markets || [];
  const allMarketPrices = marketPrices.flatMap(m => [m.min, m.max]);
  const minPrice = allMarketPrices.length > 0 ? Math.min(...allMarketPrices) : product.price;
  const maxPrice = allMarketPrices.length > 0 ? Math.max(...allMarketPrices) : product.price;
  const avgPrice = allMarketPrices.length > 0
    ? Math.round(allMarketPrices.reduce((a, b) => a + b, 0) / allMarketPrices.length)
    : product.price;

  let lowestMarket = marketPrices[0];
  let highestMarket = marketPrices[0];
  marketPrices.forEach(m => {
    if (lowestMarket && m.min < lowestMarket.min) lowestMarket = m;
    if (highestMarket && m.max > highestMarket.max) highestMarket = m;
  });

  return (
    <div className="container py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        ফিরে যান
      </Link>

      {/* Top Summary */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-6">
          {/* Emoji + Title + Description */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-7xl">{product.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {product.categoryName} ক্যাটেগরির পণ্য - {product.unit} প্রতি দাম
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  {product.categoryName}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full font-medium">
                  {product.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Price Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">সর্বনিম্ন দাম</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(minPrice)} টাকা</p>
              {lowestMarket && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                  {lowestMarket.market}
                </p>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">গড় দাম</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{formatPrice(avgPrice)} টাকা</p>
              <p className="text-xs text-gray-400 mt-1">সব বাজার মিলিয়ে</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">সর্বোচ্চ দাম</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(maxPrice)} টাকা</p>
              {highestMarket && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 truncate">
                  {highestMarket.market}
                </p>
              )}
            </div>
          </div>

          {/* Current Price Highlight */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">আজকের দাম</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)} টাকা</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full font-semibold text-lg ${changeBadge.className}`}>
                {changeBadge.label}
              </span>
            </div>
          </div>

          {/* Price History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">দামের ইতিহাস</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">আজ</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatPrice(product.price)} টাকা</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">গতকাল</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatPrice(product.yesterday)} টাকা</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">গত সপ্তাহে</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatPrice(product.lastWeek)} টাকা</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">গত মাসে</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatPrice(product.lastMonth)} টাকা</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Info */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">দাম পরিসংখ্যান</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">সর্বনিম্ন</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(minPrice)} টাকা</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">গড়</span>
                <span className="font-medium text-primary">{formatPrice(avgPrice)} টাকা</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">সর্বোচ্চ</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPrice(maxPrice)} টাকা</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-600 dark:text-gray-400">পরিবর্তন</span>
                <span className={`font-medium ${product.change > 0 ? 'text-green-600' : product.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                  {product.change > 0 ? '▲' : product.change < 0 ? '▼' : '—'} {Math.abs(product.change).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bazar-wise Prices Section (real data from API) */}
      {marketPrices.length > 0 && (
        <section aria-labelledby="bazar-prices-heading" className="mt-10">
          <h2 id="bazar-prices-heading" className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-primary">🏪</span> বাজারভিত্তিক আজকের দাম
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">বাজার</th>
                  <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">বিভাগ</th>
                  <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">সর্বনিম্ন</th>
                  <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">সর্বোচ্চ</th>
                </tr>
              </thead>
              <tbody>
                {marketPrices.map((market, index) => (
                  <tr key={index} className={`border-b border-gray-100 dark:border-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{market.market}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-400">{market.division}</td>
                    <td className="p-4 text-right font-semibold text-gray-900 dark:text-white">{formatPrice(market.min)} টাকা</td>
                    <td className="p-4 text-right font-semibold text-gray-900 dark:text-white">{formatPrice(market.max)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center italic">
            &quot;সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।&quot;
          </p>
        </section>
      )}
    </div>
  );
}