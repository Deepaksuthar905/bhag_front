"use client";

import { useState, useEffect } from "react";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import {
  catalogCacheGet,
  catalogCacheSet,
  catalogKeys,
} from "@/lib/catalog-cache";

export interface CachedSubcategory {
  _id: string;
  name: string;
  slug?: string;
}

export function useCachedSubcategories(categoryId: string) {
  const [subcategories, setSubcategories] = useState<CachedSubcategory[]>([]);

  useEffect(() => {
    const key = catalogKeys.subcategoriesByCategory(categoryId);
    const cached = catalogCacheGet<CachedSubcategory[]>(key);
    if (cached) {
      setSubcategories(cached);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetchApi<unknown>(
          API_ENDPOINTS.subcategoriesByCategory(categoryId)
        );
        if (cancelled) return;
        const raw = res as Record<string, unknown>;
        const list = Array.isArray(raw?.data)
          ? (raw.data as CachedSubcategory[])
          : Array.isArray(raw?.subcategories)
            ? (raw.subcategories as CachedSubcategory[])
            : Array.isArray(raw)
              ? (raw as unknown as CachedSubcategory[])
              : [];
        catalogCacheSet(key, list);
        setSubcategories(list);
      } catch {
        if (!cancelled) setSubcategories([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  return { subcategories };
}
