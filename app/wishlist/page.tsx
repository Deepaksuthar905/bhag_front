"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Heart,
    ShoppingCart,
    Trash2,
    IndianRupee,
    ShoppingBag,
    Package,
    XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { API_BASE_URL, fetchApi, API_ENDPOINTS } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

// Wishlist item from API
interface WishlistItemFromAPI {
    _id: string;
    product?: {
        _id: string;
        name: string;
        price: number;
        images?: string[];
        description?: string;
        material?: string;
        brand?: string;
        stock?: number;
        sizes?: { label: string; value: string }[];
    };
    productId?: {
        _id: string;
        name: string;
        price: number;
        images?: string[];
        description?: string;
        material?: string;
        brand?: string;
        stock?: number;
        sizes?: { label: string; value: string }[];
    };
}

// Normalized wishlist item
interface WishlistItem {
    _id: string;
    productId: string;
    name: string;
    price: number;
    images?: string[];
    description?: string;
    material?: string;
    brand?: string;
    stock?: number;
    sizes?: { label: string; value: string }[];
}

export default function WishlistPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { addToCart } = useCart();
    const { removeFromWishlist: contextRemoveFromWishlist } = useWishlist();
    
    // State
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login?redirect=/wishlist");
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch wishlist from API
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user?._id) return;
            
            setIsLoading(true);
            setError("");
            
            try {
                const response = await fetchApi<any>(
                    API_ENDPOINTS.wishlist(user._id)
                );
                
                console.log("Wishlist API response:", response);
                
                // Handle the response structure: { message, data: { products: [...], user, _id } }
                let products: any[] = [];
                
                if (response.data?.products && Array.isArray(response.data.products)) {
                    // Structure: { data: { products: [...] } }
                    products = response.data.products;
                } else if (Array.isArray(response.data)) {
                    // Structure: { data: [...] }
                    products = response.data;
                } else if (response.products && Array.isArray(response.products)) {
                    // Structure: { products: [...] }
                    products = response.products;
                } else if (Array.isArray(response)) {
                    // Structure: [...]
                    products = response;
                }
                
                console.log("Parsed wishlist products:", products);
                
                // Map products to WishlistItem format
                const normalizedItems: WishlistItem[] = products.map((product: any) => {
                    return {
                        _id: product._id,
                        productId: product._id,
                        name: product.name || "Product",
                        price: product.price || 0,
                        images: product.images || [],
                        description: product.description,
                        material: product.material,
                        brand: product.brand,
                        stock: product.stock,
                        sizes: product.sizes || [],
                    };
                });
                
                setWishlistItems(normalizedItems);
            } catch (err) {
                console.error("Failed to fetch wishlist:", err);
                setError("Failed to load wishlist. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && user?._id) {
            fetchWishlist();
        } else if (!authLoading && !isAuthenticated) {
            setIsLoading(false);
        }
    }, [user?._id, isAuthenticated, authLoading]);

    // Get product image
    const getProductImage = (images?: string[]): string => {
        if (!images || images.length === 0) return "/placeholder.png";
        const img = images[0];
        if (img.startsWith("http")) return img;
        if (img.startsWith("/")) return img;
        return `${API_BASE_URL.replace("/api", "")}/uploads/${img}`;
    };
    
    // Check if image is external
    const isExternalImage = (src: string): boolean => {
        return src.startsWith("http");
    };

    // Remove from wishlist via API
    const handleRemove = async (productId: string) => {
        if (!user?._id) return;
        
        setRemovingId(productId);
        
        try {
            // Use context to remove (this updates the navbar count too)
            await contextRemoveFromWishlist(productId);
            
            console.log("Removed from wishlist:", productId);
            
            // Update local state
            const updatedItems = wishlistItems.filter(item => item.productId !== productId);
            setWishlistItems(updatedItems);
        } catch (err) {
            console.error("Failed to remove from wishlist:", err);
            setError("Failed to remove item. Please try again.");
        } finally {
            setRemovingId(null);
        }
    };

    // Add to cart
    const handleAddToCart = async (item: WishlistItem) => {
        setAddingToCartId(item.productId);
        
        try {
            // Create a product object from wishlist item
            const productForCart = {
                _id: item.productId,
                name: item.name,
                price: item.price,
                images: item.images || [],
                description: item.description || "",
                material: item.material || "",
                brand: item.brand || "",
                stock: item.stock || 0,
                sizes: item.sizes || [],
            };
            
            // Add to cart with default quantity 1 (now syncs with API)
            await addToCart(productForCart as any, 1);
        } catch (err) {
            console.error("Failed to add to cart:", err);
        } finally {
            setAddingToCartId(null);
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Back Button */}
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Profile</span>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                                My Wishlist
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {wishlistItems.length} item(s) saved for later
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading wishlist...</p>
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
                        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-700 font-medium">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty Wishlist */}
                {!isLoading && !error && wishlistItems.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-red-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Save items you love by clicking the heart icon on any product.
                        </p>
                        <Link
                            href="/hardware"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Browse Products
                        </Link>
                    </div>
                )}

                {/* Wishlist Items Grid */}
                {!isLoading && !error && wishlistItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item._id}
                                className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group transition-all duration-300 ${
                                    removingId === item.productId ? "opacity-50 scale-95" : ""
                                }`}
                            >
                                {/* Product Image */}
                                <Link href={`/product/${item.productId}`} className="block relative">
                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                        {isExternalImage(getProductImage(item.images)) ? (
                                            <img
                                                src={getProductImage(item.images)}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <Image
                                                src={getProductImage(item.images)}
                                                alt={item.name}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                    </div>
                                    
                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemove(item.productId);
                                        }}
                                        disabled={removingId === item.productId}
                                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
                                    >
                                        {removingId === item.productId ? (
                                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                                        )}
                                    </button>
                                </Link>

                                {/* Product Details */}
                                <div className="p-4">
                                    <Link href={`/product/${item.productId}`}>
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    
                                    {/* Material & Brand */}
                                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                                        {item.material && <span>{item.material}</span>}
                                        {item.brand && <span>• {item.brand}</span>}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-1 mt-3 text-lg font-bold text-gray-900">
                                        <IndianRupee className="w-4 h-4" />
                                        {item.price.toLocaleString("en-IN")}
                                    </div>

                                    {/* Stock Status */}
                                    <p className={`text-xs mt-1 ${
                                        item.stock && item.stock > 0 
                                            ? "text-green-600" 
                                            : "text-red-600"
                                    }`}>
                                        {item.stock && item.stock > 0 
                                            ? `In Stock (${item.stock} available)` 
                                            : "Out of Stock"}
                                    </p>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={addingToCartId === item.productId || (item.stock !== undefined && item.stock <= 0)}
                                        className="w-full mt-4 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingToCartId === item.productId ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Continue Shopping */}
                {!isLoading && !error && wishlistItems.length > 0 && (
                    <div className="mt-8 text-center">
                        <Link
                            href="/hardware"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <Package className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
