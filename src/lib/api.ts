const BASE_URL = 'https://openapi.programming-hero.com/api/bazardor';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API failed: ${response.status}`);
  }

  return response.json();
}

interface RawProduct {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
}

interface RawCategory {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface NormalizedProduct {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  category: string;
  categoryName: string;
  unit: string;
  price: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: number;
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
}

export interface NormalizedCategory {
  id: string;
  slug: string;
  name: string;
  emoji: string;
}

export function normalizeProduct(raw: RawProduct): NormalizedProduct {
  const pct = Number(raw.change?.pct ?? 0);
  const change = raw.change?.dir === 'down'
    ? Math.abs(pct) * -1
    : raw.change?.dir === 'up'
      ? Math.abs(pct)
      : 0;

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.nameBn,
    emoji: raw.image || raw.categoryIcon || '📦',
    category: raw.category,
    categoryName: raw.categoryNameBn,
    unit: raw.unit,
    price: raw.today,
    yesterday: raw.yesterday,
    lastWeek: raw.lastWeek,
    lastMonth: raw.lastMonth,
    change,
    markets: raw.markets || [],
  };
}

function normalizeCategory(raw: RawCategory): NormalizedCategory {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.nameBn,
    emoji: raw.icon || '📦',
  };
}

export async function getProducts(category?: string): Promise<NormalizedProduct[]> {
  const endpoint = category ? `/products?category=${category}` : '/products';
  const data = await fetchAPI<RawProduct[]>(endpoint);
  return (data || []).map(normalizeProduct);
}

export async function getProduct(slug: string): Promise<NormalizedProduct | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getCategories(): Promise<NormalizedCategory[]> {
  const data = await fetchAPI<RawCategory[]>('/categories');
  return (data || []).map(normalizeCategory);
}

export async function getCategory(slug: string): Promise<NormalizedCategory | null> {
  const categories = await getCategories();
  return categories.find((category) => category.id === slug || category.slug === slug) || null;
}