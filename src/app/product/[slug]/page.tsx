import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProduct } from '@/lib/api';
import { toBengaliDigits } from '@/types';

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
  const marketPrices = product.markets || [];
  const allMarketPrices = marketPrices.flatMap((market) => [market.min, market.max]);
  const minPrice = allMarketPrices.length > 0 ? Math.min(...allMarketPrices) : product.price;
  const maxPrice = allMarketPrices.length > 0 ? Math.max(...allMarketPrices) : product.price;
  const avgPrice = allMarketPrices.length > 0
    ? Math.round(allMarketPrices.reduce((total, value) => total + value, 0) / allMarketPrices.length)
    : product.price;

  let lowestMarket = marketPrices[0];
  let highestMarket = marketPrices[0];

  marketPrices.forEach((market) => {
    if (lowestMarket && market.min < lowestMarket.min) lowestMarket = market;
    if (highestMarket && market.max > highestMarket.max) highestMarket = market;
  });

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <div className="mx-auto max-w-[1152px] px-4 pb-12 pt-6 md:px-6 xl:px-0">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280]">
            <li>
              <Link href="/" className="transition-colors hover:text-[#16A34A]">
                হোম
              </Link>
            </li>
            <li className="text-[#9CA3AF]">›</li>
            <li>
              <Link
                href={product.category === 'chal' ? '/' : `/category/${product.category}`}
                className="transition-colors hover:text-[#16A34A]"
              >
                {product.categoryName}
              </Link>
            </li>
            <li className="text-[#9CA3AF]">›</li>
            <li className="font-medium text-[#111827]">{product.name}</li>
          </ol>
        </nav>

        <section className="rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF7EE] text-4xl shadow-inner shadow-[#E5E7EB]">
                  {product.emoji}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#111827] md:text-[2.2rem]">
                    {product.name}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#6B7280]">
                    <span>প্রতি {product.unit}</span>
                    <span className="h-1 w-1 rounded-full bg-[#D1D5DB]" />
                    <span>{product.categoryName}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#EAF7EE] px-3 py-1 text-sm font-medium text-[#15803D]">
                      {product.categoryName}
                    </span>
                    <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-sm font-medium text-[#4B5563]">
                      {product.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[330px] rounded-[18px] border border-[#DDF2E4] bg-[#F4FBF6] px-4 py-5">
                <p className="text-sm font-medium text-[#6B7280]">আজকের দাম</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-[-0.04em] text-[#111827] md:text-[2.6rem]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="mb-1 text-base text-[#4B5563]">টাকা / {product.unit}</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ${changeBadge.className}`}>
                    {changeBadge.label}
                  </span>
                  <span className="text-sm text-[#6B7280]">গতকালের তুলনায়</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
            <p className="text-sm font-medium text-[#6B7280]">সর্বনিম্ন দাম</p>
            <p className="mt-3 text-2xl font-bold text-[#111827]">{formatPrice(minPrice)} টাকা</p>
            {lowestMarket && <p className="mt-2 text-xs text-[#16A34A]">{lowestMarket.market}</p>}
          </div>

          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
            <p className="text-sm font-medium text-[#6B7280]">গড় দাম</p>
            <p className="mt-3 text-2xl font-bold text-[#16A34A]">{formatPrice(avgPrice)} টাকা</p>
            <p className="mt-2 text-xs text-[#9CA3AF]">সব বাজার মিলিয়ে</p>
          </div>

          <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
            <p className="text-sm font-medium text-[#6B7280]">সর্বোচ্চ দাম</p>
            <p className="mt-3 text-2xl font-bold text-[#111827]">{formatPrice(maxPrice)} টাকা</p>
            {highestMarket && <p className="mt-2 text-xs text-[#DC2626]">{highestMarket.market}</p>}
          </div>
        </section>

        {marketPrices.length > 0 && (
          <section aria-labelledby="bazar-prices-heading" className="mt-8 rounded-[24px] border border-[#E5E7EB] bg-white p-4 md:p-6">
            <h2 id="bazar-prices-heading" className="mb-5 text-[1.7rem] font-bold tracking-[-0.03em] text-[#111827]">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="overflow-hidden rounded-[18px] border border-[#E5E7EB]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm" role="table">
                  <thead className="bg-[#F9FAFB]">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-[#111827]">বাজার</th>
                      <th className="px-4 py-3 text-left font-semibold text-[#111827]">বিভাগ</th>
                      <th className="px-4 py-3 text-right font-semibold text-[#111827]">সর্বনিম্ন</th>
                      <th className="px-4 py-3 text-right font-semibold text-[#111827]">সর্বাধিক</th>
                      <th className="px-4 py-3 text-right font-semibold text-[#111827]">গড়</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketPrices.map((market, index) => {
                      const averagePrice = Math.round((market.min + market.max) / 2);

                      return (
                        <tr key={`${market.market}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
                          <td className="px-4 py-3 font-medium text-[#111827]">{market.market}</td>
                          <td className="px-4 py-3 text-[#4B5563]">{market.division}</td>
                          <td className="px-4 py-3 text-right font-medium text-[#111827]">{formatPrice(market.min)} টাকা</td>
                          <td className="px-4 py-3 text-right font-medium text-[#111827]">{formatPrice(market.max)} টাকা</td>
                          <td className="px-4 py-3 text-right font-medium text-[#16A34A]">{formatPrice(averagePrice)} টাকা</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}