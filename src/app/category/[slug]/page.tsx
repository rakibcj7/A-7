import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, getCategories, getCategory } from '@/lib/api';
import { CategoryProductList } from '@/components/CategoryProductList';
import Link from 'next/link';
import { Button } from '@/components/Button';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  const catName = category?.name || slug;
  return {
    title: `${catName} | বাজার দর`,
    description: `${catName} ক্যাটেগরির সব পণ্যের দাম দেখুন। আজকের দাম, পরিবর্তন এবং বিস্তারিত তথ্য।`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getCategory(slug),
    getProducts(slug),
    getCategories(),
  ]);

  const categoryName = category?.name || slug;
  const categoryEmoji = category?.emoji || '📦';

  if (!categories.some((item) => item.id === slug || item.slug === slug) && products.length === 0) {
    notFound();
  }

  return (
    <div className="container py-8">
      <CategoryProductList
        products={products}
        categoryName={categoryName}
        categoryEmoji={categoryEmoji}
      />

      {products.length === 0 && (
        <div className="mt-4 text-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">হোম পেজে ফিরে যান</Button>
          </Link>
        </div>
      )}
    </div>
  );
}