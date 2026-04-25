"use client";

import { useState, useEffect } from "react";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import type { Product } from "@/lib/types";
import {
  catalogCacheGet,
  catalogCacheSet,
  catalogKeys,
  parseProductsFromCategoryResponse,
  parseProductsFromSubcategoryResponse,
} from "@/lib/catalog-cache";

export function useCachedHardwareProducts(
  categoryId: string,
  subcategoryId: string | null
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const key = subcategoryId
      ? catalogKeys.productsBySubcategory(subcategoryId)
      : catalogKeys.productsByCategory(categoryId);

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
        let productsData: Product[] = [];
        if (subcategoryId) {
          const response = await fetchApi<unknown>(
            API_ENDPOINTS.subcategoryById(subcategoryId)
          );
          productsData = parseProductsFromSubcategoryResponse(response);
        } else {
          const response = await fetchApi<unknown>(
            API_ENDPOINTS.productsByCategory(categoryId)
          );
          productsData = parseProductsFromCategoryResponse(response);
        }
        catalogCacheSet(key, productsData);
        if (!cancelled) setProducts(productsData);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId, subcategoryId]);

  return { products, isLoading };
}
