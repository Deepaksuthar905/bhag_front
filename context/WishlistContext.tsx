"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
    wishlistCount: number;
    wishlistProductIds: string[];
    isInWishlist: (productId: string) => boolean;
    addToWishlist: (productId: string) => Promise<boolean>;
    removeFromWishlist: (productId: string) => Promise<boolean>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Fetch wishlist from API
    const refreshWishlist = async () => {
        if (!user?._id || !isAuthenticated) {
            setWishlistProductIds([]);
            setWishlistCount(0);
            return;
        }

        try {
            const response = await fetchApi<unknown>(API_ENDPOINTS.wishlist(user._id));
            const raw = response as { data?: unknown[] | { products?: unknown[] }; products?: unknown[] };
            let products: any[] = [];
            if (raw?.data && typeof raw.data === "object" && !Array.isArray(raw.data) && Array.isArray((raw.data as { products?: unknown[] }).products)) {
                products = (raw.data as { products: any[] }).products;
            } else if (Array.isArray(raw?.data)) {
                products = raw.data as any[];
            } else if (Array.isArray(raw?.products)) {
                products = raw.products as any[];
            }
            
            const productIds = products.map((p: any) => p._id);
            setWishlistProductIds(productIds);
            setWishlistCount(productIds.length);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    };

    // Load wishlist on mount and when user changes
    useEffect(() => {
        if (isAuthenticated && user?._id) {
            refreshWishlist();
        } else {
            setWishlistProductIds([]);
            setWishlistCount(0);
        }
    }, [user?._id, isAuthenticated]);

    // Check if product is in wishlist
    const isInWishlist = (productId: string): boolean => {
        return wishlistProductIds.includes(productId);
    };

    // Add to wishlist
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

            // Update local state
            setWishlistProductIds((prev) => [...prev, productId]);
            setWishlistCount((prev) => prev + 1);
            return true;
        } catch (err) {
            console.error("Failed to add to wishlist:", err);
            return false;
        }
    };

    // Remove from wishlist
    const removeFromWishlist = async (productId: string): Promise<boolean> => {
        if (!user?._id || !isAuthenticated) return false;

        try {
            await fetchApi(API_ENDPOINTS.removeFromWishlist(productId, user._id), {
                method: "DELETE",
            });

            // Update local state
            setWishlistProductIds((prev) => prev.filter((id) => id !== productId));
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
