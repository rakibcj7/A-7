'use client';

import Link from 'next/link';
import { toBengaliDigits } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    name: string;
    emoji: string;
    category: string;
    categoryName?: string;
    unit: string;
    price: number;
    change: number;
  };
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const isPositive = product.change > 0;
  const isNegative = product.change < 0;
  const changePercent = Math.abs(product.change).toFixed(1);

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group relative bg-white rounded-2xl border border-[#E5E7EB]',
        'overflow-hidden transition-all duration-300 hover:shadow-[0_8px_22px_rgba(17,17,17,0.08)] hover:-translate-y-0.5',
        'flex flex-col h-full shadow-[0_1px_2px_rgba(17,17,17,0.04)]'
      )}
    >
      <div className="relative aspect-square bg-[#F5F7F8] flex items-center justify-center text-6xl">
        {product.emoji}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#111111] text-base line-clamp-1 flex-1">
            {product.name}
          </h3>
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0',
            isPositive ? 'bg-green-100 text-green-700' :
            isNegative ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          )}>
            {isPositive ? '▲' : isNegative ? '▼' : '—'} {toBengaliDigits(changePercent)}%
          </span>
        </div>

        <p className="text-sm text-[#4B5563] mb-2">
          {product.categoryName || product.category} • {
            product.unit === 'kg' ? 'প্রতি কেজি' :
            product.unit === 'litre' || product.unit === 'liter' ? 'প্রতি লিটার' :
            product.unit === 'doz' || product.unit === 'dozen' ? 'প্রতি ডজন' :
            product.unit === 'pcs' || product.unit === 'piece' ? 'প্রতি পিস' :
            `প্রতি ${product.unit}`
          }
        </p>

        <div className="mt-auto pt-3 border-t border-[#F1F5F9]">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[#4B5563]">
              আজকের দাম
            </span>
            <span className="font-bold text-lg text-[#111111]">
              {toBengaliDigits(product.price.toLocaleString('bn-BD'))} টাকা
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}