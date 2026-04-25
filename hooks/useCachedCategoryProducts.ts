"use client";

import { useState, useEffect } from "react";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import type { Product } from "@/lib/types";
import {
  catalogCacheGet,
  catalogCacheSet,
  catalogKeys,
  parseProductsFromCategoryResponse,
} from "@/lib/catalog-cache";

export function useCachedCategoryProducts(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const key = catalogKeys.productsByCategory(categoryId);
    const cached = catalogCacheGet<Product[]>(key);
    if (cached) {
      setProducts(cached);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetchApi<unknown>(
          API_ENDPOINTS.productsByCategory(categoryId)
        );
        if (cancelled) return;
        const productsData = parseProductsFromCategoryResponse(response);
        catalogCacheSet(key, productsData);
        setProducts(productsData);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  return { products, isLoading };
}
