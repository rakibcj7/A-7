export interface Product {
  id: number;
  name: string;
  emoji: string;
  category: string;
  unit: string;
  price: number;
  change: number;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  bazarPrices?: BazarPrice[];
}

export interface BazarPrice {
  bazarName: string;
  price: number;
  unit: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export type SortOption = 0 | 1 | 2;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 0, label: 'ডিফল্ট' },
  { value: 1, label: 'দাম: কম থেকে বেশি' },
  { value: 2, label: 'দাম: বেশি থেকে কম' },
];

export function sortProducts<T extends { price: number }>(products: T[], sort: SortOption): T[] {
  const list = [...products];

  switch (sort) {
    case 1:
      return list.sort((a, b) => a.price - b.price);
    case 2:
      return list.sort((a, b) => b.price - a.price);
    default:
      return list;
  }
}

export const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
}

export function fromBengaliDigits(str: string): number {
  return parseInt(
    str.replace(/[০-৯]/g, (d) => BENGALI_DIGITS.indexOf(d).toString()),
    10,
  );
}