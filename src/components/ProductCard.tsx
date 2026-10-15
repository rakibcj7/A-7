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
        'group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
        'overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        'flex flex-col h-full'
      )}
    >
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-6xl">
        {product.emoji}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-1 flex-1">
            {product.name}
          </h3>
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0',
            isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            isNegative ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          )}>
            {isPositive ? '▲' : isNegative ? '▼' : '—'} {toBengaliDigits(changePercent)}%
          </span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {product.categoryName || product.category} • {
            product.unit === 'kg' ? 'প্রতি কেজি' :
            product.unit === 'litre' || product.unit === 'liter' ? 'প্রতি লিটার' :
            product.unit === 'doz' || product.unit === 'dozen' ? 'প্রতি ডজন' :
            product.unit === 'pcs' || product.unit === 'piece' ? 'প্রতি পিস' :
            `প্রতি ${product.unit}`
          }
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              আজকের দাম
            </span>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {toBengaliDigits(product.price.toLocaleString('bn-BD'))} টাকা
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}