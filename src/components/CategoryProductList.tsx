'use client';

import { useMemo, useState } from 'react';

import { ProductCard } from '@/components/ProductCard';
import type { NormalizedProduct } from '@/lib/api';
import { SORT_OPTIONS, sortProducts, type SortOption } from '@/types';

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
  const [sort, setSort] = useState<SortOption>(0);

  const sortedProducts = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label={categoryName}>
            {categoryEmoji}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {categoryName}
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              মোট {products.length} টি পণ্য
            </p>
          </div>
        </div>

        {products.length > 0 && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-select"
              className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
            >
              সাজান:
            </label>
            <select
              id="sort-select"
              name="sort"
              value={sort}
              onChange={(event) => setSort(Number(event.target.value) as SortOption)}
              className="input w-auto min-w-[200px] cursor-pointer bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {sortedProducts.length > 0 ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
        >
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">{categoryEmoji}</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            এই ক্যাটেগরিতে কোনো পণ্য নেই
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            ফিলহাল {categoryName} ক্যাটেগরিতে কোনো পণ্য উপলব্ধ নেই।
          </p>
        </div>
      )}
    </>
  );
}
