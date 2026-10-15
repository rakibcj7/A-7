'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { SORT_OPTIONS, type SortOption } from '@/types';
import type { NormalizedProduct } from '@/lib/api';

interface CategoryProductListProps {
  products: NormalizedProduct[];
  categoryName: string;
  categoryEmoji: string;
}

export function CategoryProductList({
  products,
  categoryName,
  categoryEmoji,
}: CategoryProductListProps) {
  const [sort, setSort] = useState<SortOption>('default');

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [products, sort]);

  return (
    <>
      {/* Category Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label={categoryName}>
            {categoryEmoji}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {categoryName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              মোট {products.length} টি পণ্য
            </p>
          </div>
        </div>

        {/* Sort Dropdown (Challenge C1) */}
        {products.length > 0 && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-select"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              সাজান:
            </label>
            <select
              id="sort-select"
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input w-auto min-w-[200px] bg-white dark:bg-gray-800 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          role="list"
        >
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">{categoryEmoji}</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            এই ক্যাটেগরিতে কোনো পণ্য নেই
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            ফিলহাল {categoryName} ক্যাটেগরিতে কোনো পণ্য উপলব্ধ নেই।
          </p>
        </div>
      )}
    </>
  );
}
