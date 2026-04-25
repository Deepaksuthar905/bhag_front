"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useCachedSubcategories } from "@/hooks/useCachedSubcategories";
import { useCachedCategoryProductsWithSubcategory } from "@/hooks/useCachedCategoryProductsWithSubcategory";

const HANDICRAFT_CATEGORY_ID = "69a1f2a0c92e1e7aca7f2801";

function HandicraftPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subcategoryId = searchParams.get("subcategory");
    const { subcategories } = useCachedSubcategories(HANDICRAFT_CATEGORY_ID);
    const { products, isLoading } = useCachedCategoryProductsWithSubcategory(
        HANDICRAFT_CATEGORY_ID,
        subcategoryId
    );
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [togglingWishlistId, setTogglingWishlistId] = useState<string | null>(null);
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    const handleImageLoad = (productId: string) => {
        setLoadedImages((prev) => new Set(prev).add(productId));
    };

    const handleToggleWishlist = async (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setTogglingWishlistId(productId);
        try {
            if (isInWishlist(productId)) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        } catch (error) {
            console.error("Failed to toggle wishlist:", error);
        } finally {
            setTogglingWishlistId(null);
        }
    };

    const getProductImage = (product: Product): string => {
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            return img.startsWith("http") ? img : `/${img}`;
        }
        return "/placeholder.svg";
    };

    const formatPrice = (price: number): string => {
        return `₹${price.toLocaleString("en-IN")}`;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 opacity-30 rounded-3xl blur-3xl animate-pulse"></div>
                    <div className="relative animate-fadeInDown">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-700">
                            Handicraft Collection
                        </h1>
                        <p className="text-lg text-gray-600 font-medium animate-fadeInUp delay-200">
                            Beautiful handcrafted items made with traditional artistry
                        </p>
                        <div className="mt-6 flex justify-center gap-2 animate-fadeInUp delay-300">
                            <div className="h-1 w-12 bg-gray-400 rounded-full animate-slideInLeft"></div>
                            <div className="h-1 w-8 bg-gray-500 rounded-full animate-pulse"></div>
                            <div className="h-1 w-12 bg-gray-400 rounded-full animate-slideInRight"></div>
                        </div>
                    </div>
                </div>

                {/* Subcategories in a horizontal line */}
                {subcategories.length > 0 && (
                    <div className="mb-8 animate-fadeInUp">
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
                            <Link
                                href="/handicraft"
                                className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${
                                    !subcategoryId
                                        ? "bg-gray-800 text-white border-gray-800"
                                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800"
                                }`}
                            >
                                All
                            </Link>
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub._id}
                                    href={`/handicraft?subcategory=${encodeURIComponent(sub._id)}`}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${
                                        subcategoryId === sub._id
                                            ? "bg-gray-800 text-white border-gray-800"
                                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800"
                                    }`}
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 animate-pulse"
                            >
                                <div className="aspect-square bg-gray-200"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                            <p className="text-gray-600">We couldn't find any handicraft products at the moment. Please check back later.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product, index) => (
                            <div
                                key={product._id}
                                onClick={() => handleProductClick(product._id)}
                                className="cursor-pointer group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-gray-400 transform hover:-translate-y-3 hover:scale-[1.02] animate-fadeInUp"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: "both",
                                }}
                            >
                                <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                                    {!loadedImages.has(product._id) && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                    )}
                                    
                                    {product.stock && product.stock > 0 && (
                                        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-full z-10 shadow-lg animate-bounceIn">
                                            In Stock
                                        </span>
                                    )}
                                    
                                    <button 
                                        onClick={(e) => handleToggleWishlist(e, product._id)}
                                        disabled={togglingWishlistId === product._id}
                                        className={`absolute top-2 right-2 sm:top-4 sm:right-4 bg-white p-1.5 sm:p-2.5 rounded-full shadow-lg transition-all duration-300 z-10 hover:bg-red-50 hover:scale-110 active:scale-95 animate-scaleIn ${
                                            isInWishlist(product._id) 
                                                ? "opacity-100" 
                                                : "opacity-0 group-hover:opacity-100"
                                        } ${togglingWishlistId === product._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <Heart 
                                            size={14} 
                                            className={`sm:w-[18px] sm:h-[18px] transition-colors ${
                                                isInWishlist(product._id)
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-gray-700 group-hover:text-red-500"
                                            }`} 
                                        />
                                    </button>
                                    
                                    <img
                                        src={getProductImage(product)}
                                        alt={product.name}
                                        onLoad={() => handleImageLoad(product._id)}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                            handleImageLoad(product._id);
                                        }}
                                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                                            loadedImages.has(product._id) ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-gray-400/0 group-hover:bg-gray-400/10 transition-all duration-700 blur-xl"></div>
                                </div>
                                
                                <div className="p-3 sm:p-5 bg-gradient-to-b from-white to-gray-50">
                                    {product.category && (
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                                            {product.category.name}
                                        </span>
                                    )}
                                    
                                    <h3 className="font-bold mb-1 sm:mb-2 text-gray-900 group-hover:text-gray-700 transition-all duration-300 text-sm sm:text-lg group-hover:translate-x-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    
                                    {product.material && (
                                        <p className="text-xs text-gray-500 mb-1">
                                            {product.material}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                                        <p className="text-base sm:text-xl font-bold text-gray-700 group-hover:scale-105 transition-transform duration-300">
                                            {formatPrice(product.price)}
                                        </p>
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            className="px-2 py-1 sm:px-4 sm:py-1.5 bg-gray-700 text-white text-xs sm:text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-110 active:scale-95 transform hover:translate-x-1"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes bounceIn {
                    0% { opacity: 0; transform: scale(0.3) translateY(-20px); }
                    50% { opacity: 1; transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeInDown { animation: fadeInDown 0.8s ease-out; }
                .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
                .animate-slideInLeft { animation: slideInLeft 0.6s ease-out 0.4s both; }
                .animate-slideInRight { animation: slideInRight 0.6s ease-out 0.4s both; }
                .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
                .animate-shimmer { animation: shimmer 2s infinite; }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
            `}</style>
        </div>
    );
}

function HandicraftPageFallback() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

export default function HandicraftPage() {
    return (
        <Suspense fallback={<HandicraftPageFallback />}>
            <HandicraftPageContent />
        </Suspense>
    );
}
