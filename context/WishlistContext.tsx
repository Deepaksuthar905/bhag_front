"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import { useAuth } from "./AuthContext";

export interface WishlistProductView {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
  material?: string;
  brand?: string;
  stock?: number;
  sizes?: { label: string; value: string }[];
}

interface WishlistContextType {
  wishlistCount: number;
  wishlistProductIds: string[];
  wishlistProducts: WishlistProductView[];
  wishlistLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function parseWishlistProducts(response: unknown): WishlistProductView[] {
  const raw = response as {
    data?: unknown[] | { products?: unknown[] };
    products?: unknown[];
  };
  let products: any[] = [];
  if (
    raw?.data &&
    typeof raw.data === "object" &&
    !Array.isArray(raw.data) &&
    Array.isArray((raw.data as { products?: unknown[] }).products)
  ) {
    products = (raw.data as { products: any[] }).products;
  } else if (Array.isArray(raw?.data)) {
    products = raw.data as any[];
  } else if (Array.isArray(raw?.products)) {
    products = raw.products as any[];
  } else if (Array.isArray(raw)) {
    products = raw as any[];
  }

  return products.map((product: any) => ({
    _id: product._id,
    name: product.name || "Product",
    price: product.price || 0,
    images: product.images || [],
    description: product.description,
    material: product.material,
    brand: product.brand,
    stock: product.stock,
    sizes: product.sizes || [],
  }));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProductView[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!user?._id || !isAuthenticated) {
      setWishlistProductIds([]);
      setWishlistProducts([]);
      setWishlistCount(0);
      return;
    }

    setWishlistLoading(true);
    try {
      const response = await fetchApi<unknown>(API_ENDPOINTS.wishlist(user._id));
      const products = parseWishlistProducts(response);
      const productIds = products.map((p) => p._id);
      setWishlistProducts(products);
      setWishlistProductIds(productIds);
      setWishlistCount(productIds.length);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setWishlistLoading(false);
    }
  }, [user?._id, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      refreshWishlist();
    } else {
      setWishlistProductIds([]);
      setWishlistProducts([]);
      setWishlistCount(0);
    }
  }, [user?._id, isAuthenticated, refreshWishlist]);

  const isInWishlist = (productId: string): boolean =>
    wishlistProductIds.includes(productId);

  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!user?._id || !isAuthenticated) return false;

    try {
      await fetchApi(API_ENDPOINTS.addToWishlist, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          productId: productId,
        }),
      });
      await refreshWishlist();
      return true;
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!user?._id || !isAuthenticated) return false;

    try {
      await fetchApi(API_ENDPOINTS.removeFromWishlist(productId, user._id), {
        method: "DELETE",
      });

      setWishlistProductIds((prev) => prev.filter((id) => id !== productId));
      setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
      setWishlistCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        wishlistProductIds,
        wishlistProducts,
        wishlistLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
