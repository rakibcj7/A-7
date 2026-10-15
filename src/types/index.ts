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

export type SortOption = 'default' | 'price-asc' | 'price-desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'ডিফল্ট' },
  { value: 'price-asc', label: 'দাম: কম থেকে বেশি' },
  { value: 'price-desc', label: 'দাম: বেশি থেকে কম' },
];

export const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
}

export function fromBengaliDigits(str: string): number {
  return parseInt(
    str.replace(/[০-৯]/g, (d) => BENGALI_DIGITS.indexOf(d).toString()),
    10
  );
}