const BASE_URL = 'https://openapi.programming-hero.com/api/bazardor';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`API failed: ${response.status}`);
  return response.json();
}

// Raw shape from the API for a single product
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

// Raw shape from the API for a category
interface RawCategory {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

// Normalized product used throughout the app
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
  change: number; // percentage, positive = price went up
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
}

// Normalized category used throughout the app
export interface NormalizedCategory {
  id: string;
  slug: string;
  name: string;
  emoji: string;
}

function normalizeProduct(raw: RawProduct): NormalizedProduct {
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
    change: raw.change.dir === 'down' ? -raw.change.pct : raw.change.pct,
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
  // API returns a raw array, not { products: [...] }
  const data = await fetchAPI<RawProduct[]>(endpoint);
  return (data || []).map(normalizeProduct);
}

export async function getProduct(slug: string): Promise<NormalizedProduct | null> {
  // There is no single-product endpoint — fetch all and find by slug
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getCategories(): Promise<NormalizedCategory[]> {
  // API returns a raw array, not { categories: [...] }
  const data = await fetchAPI<RawCategory[]>('/categories');
  return (data || []).map(normalizeCategory);
}

export async function getCategory(slug: string): Promise<NormalizedCategory | null> {
  // There is no single-category endpoint — fetch all and find by slug
  const categories = await getCategories();
  return categories.find((c) => c.id === slug || c.slug === slug) || null;
}