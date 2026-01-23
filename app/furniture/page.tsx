"use client";

import React, { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    rating: number;
    isNew?: boolean;
}

export default function FurniturePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleImageLoad = (productId: number) => {
        setLoadedImages((prev) => new Set(prev).add(productId));
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section with Gradient - Animated */}
                <div className="text-center mb-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 opacity-30 rounded-3xl blur-3xl animate-pulse"></div>
                    <div className="relative animate-fadeInDown">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-700">
                            Furniture Collection
                        </h1>
                        <p className="text-lg text-gray-600 font-medium animate-fadeInUp delay-200">
                            Elegant furniture pieces to transform your living spaces
                        </p>
                        <div className="mt-6 flex justify-center gap-2 animate-fadeInUp delay-300">
                            <div className="h-1 w-12 bg-gray-400 rounded-full animate-slideInLeft"></div>
                            <div className="h-1 w-8 bg-gray-500 rounded-full animate-pulse"></div>
                            <div className="h-1 w-12 bg-gray-400 rounded-full animate-slideInRight"></div>
                        </div>
                    </div>
                </div>

                {/* Products Grid with Staggered Animation */}
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
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-gray-400 transform hover:-translate-y-3 hover:scale-[1.02] animate-fadeInUp"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: "both",
                                }}
                            >
                                <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                                    {/* Shimmer effect on image load */}
                                    {!loadedImages.has(product.id) && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                    )}
                                    
                                    {product.isNew && (
                                        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-full z-10 shadow-lg animate-bounceIn">
                                            NEW
                                        </span>
                                    )}
                                    
                                    <button className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white p-1.5 sm:p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-red-50 hover:scale-110 active:scale-95 animate-scaleIn">
                                        <Heart size={14} className="sm:w-[18px] sm:h-[18px] text-gray-700 group-hover:text-red-500 transition-colors" />
                                    </button>
                                    
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        onLoad={() => handleImageLoad(product.id)}
                                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                                            loadedImages.has(product.id) ? "opacity-100" : "opacity-0"
                                        }`}
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 bg-gray-400/0 group-hover:bg-gray-400/10 transition-all duration-700 blur-xl"></div>
                                </div>
                                
                                <div className="p-3 sm:p-5 bg-gradient-to-b from-white to-gray-50">
                                    <div className="flex items-center mb-2 sm:mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={`sm:w-4 sm:h-4 transition-all duration-300 ${
                                                    i < product.rating
                                                        ? "fill-yellow-400 text-yellow-400 drop-shadow-sm group-hover:scale-110 group-hover:rotate-12"
                                                        : "text-gray-300"
                                                }`}
                                                style={{ transitionDelay: `${i * 50}ms` }}
                                            />
                                        ))}
                                    </div>
                                    
                                    <h3 className="font-bold mb-1 sm:mb-2 text-gray-900 group-hover:text-gray-700 transition-all duration-300 text-sm sm:text-lg group-hover:translate-x-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                                        <p className="text-base sm:text-xl font-bold text-gray-700 group-hover:scale-105 transition-transform duration-300">
                                            {product.price}
                                        </p>
                                        <button className="px-2 py-1 sm:px-4 sm:py-1.5 bg-gray-700 text-white text-xs sm:text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-110 active:scale-95 transform hover:translate-x-1">
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes bounceIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) translateY(-20px);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-fadeInDown {
                    animation: fadeInDown 0.8s ease-out;
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }

                .animate-slideInLeft {
                    animation: slideInLeft 0.6s ease-out 0.4s both;
                }

                .animate-slideInRight {
                    animation: slideInRight 0.6s ease-out 0.4s both;
                }

                .animate-bounceIn {
                    animation: bounceIn 0.6s ease-out;
                }

                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }

                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }

                .delay-200 {
                    animation-delay: 0.2s;
                }

                .delay-300 {
                    animation-delay: 0.3s;
                }
            `}</style>
        </div>
    );
}
