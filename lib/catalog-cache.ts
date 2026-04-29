import type { Product } from "@/lib/types";

/** How long list data stays valid without refetch (navigate away and back). */
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function catalogCacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function catalogCacheSet<T>(
  key: string,
  value: T,
  ttlMs: number = DEFAULT_TTL_MS
): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export const catalogKeys = {
  productsByCategory: (categoryId: string) => `products:cat:${categoryId}`,
  productsBySubcategory: (subcategoryId: string) => `products:sub:${subcategoryId}`,
  subcategoriesByCategory: (categoryId: string) => `subcats:${categoryId}`,
};

export function parseProductsFromCategoryResponse(raw: unknown): Product[] {
  const r = raw as {
    data?: Product[] | { products?: Product[] };
    products?: Product[];
  };
  if (Array.isArray(r?.data)) return r.data;
  if (
    r?.data &&
    typeof r.data === "object" &&
    Array.isArray((r.data as { products?: Product[] }).products)
  ) {
    return (r.data as { products: Product[] }).products;
  }
  if (Array.isArray(r?.products)) return r.products;
  if (Array.isArray(r)) return r as Product[];
  return [];
}

export function parseProductsFromSubcategoryResponse(raw: unknown): Product[] {
  const r = raw as {
    data?: { products?: Product[] } | Product[];
    products?: Product[];
  };
  if (r?.data && typeof r.data === "object" && !Array.isArray(r.data)) {
    const d = r.data as { products?: Product[] };
    if (Array.isArray(d.products)) return d.products;
  }
  if (Array.isArray(r?.data)) return r.data as Product[];
  if (Array.isArray(r?.products)) return r.products;
  if (Array.isArray(r)) return r as Product[];
  return [];
}
