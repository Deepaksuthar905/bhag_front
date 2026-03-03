"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    ArrowLeft,
    IndianRupee,
    ShoppingCart,
    Heart,
    Package,
    XCircle,
    Filter,
} from "lucide-react";
import { fetchApi, API_BASE_URL, API_ENDPOINTS } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

interface Product {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    description?: string;
    material?: string;
    brand?: string;
    stock?: number;
    category?: string | { name: string };
    sizes?: { label: string; value: string }[];
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";
    
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { isAuthenticated } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState(query);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
    const [togglingWishlistId, setTogglingWishlistId] = useState<string | null>(null);

    // Fetch search results
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError("");

            try {
                const response = await fetchApi<any>(API_ENDPOINTS.search(query));
                console.log("Search API response:", response);

                // Handle different response structures
                let searchResults: Product[] = [];
                if (response.data && Array.isArray(response.data)) {
                    searchResults = response.data;
                } else if (Array.isArray(response)) {
                    searchResults = response;
                } else if (response.products && Array.isArray(response.products)) {
                    searchResults = response.products;
                }

                setProducts(searchResults);
            } catch (err) {
                console.error("Search failed:", err);
                setError("Failed to search products. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    // Get product image
    const getProductImage = (images?: string[]): string => {
        if (!images || images.length === 0) return "/placeholder.svg";
        const img = images[0];
        if (img.startsWith("http")) return img;
        if (img.startsWith("/")) return img;
        return `${API_BASE_URL.replace("/api", "")}/uploads/${img}`;
    };

    // Check if image is external
    const isExternalImage = (src: string): boolean => {
        return src.startsWith("http");
    };

    // Handle new search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    // Handle add to cart
    const handleAddToCart = (product: Product) => {
        setAddingToCartId(product._id);
        addToCart(product as any, 1);
        setTimeout(() => setAddingToCartId(null), 500);
    };

    // Handle wishlist toggle
    const handleToggleWishlist = async (productId: string) => {
        if (!isAuthenticated) {
            router.push("/login?redirect=/search?q=" + encodeURIComponent(query));
            return;
        }

        setTogglingWishlistId(productId);
        try {
            if (isInWishlist(productId)) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        } finally {
            setTogglingWishlistId(null);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Search className="w-7 h-7 text-gray-600" />
                                Search Results
                            </h1>
                            {query && (
                                <p className="text-gray-600 mt-1">
                                    {isLoading
                                        ? "Searching..."
                                        : `${products.length} result(s) for "${query}"`}
                                </p>
                            )}
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Searching products...</p>
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

                {/* No Query */}
                {!query && !isLoading && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Start searching
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Enter a keyword to find products
                        </p>
                    </div>
                )}

                {/* No Results */}
                {query && !isLoading && !error && products.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            No products found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We couldn't find any products matching "{query}". Try a different search term.
                        </p>
                        <Link
                            href="/hardware"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                        >
                            Browse All Products
                        </Link>
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-lg"
                            >
                                {/* Product Image */}
                                <Link href={`/product/${product._id}`} className="block relative">
                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                        {isExternalImage(getProductImage(product.images)) ? (
                                            <img
                                                src={getProductImage(product.images)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <Image
                                                src={getProductImage(product.images)}
                                                alt={product.name}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                    </div>

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleToggleWishlist(product._id);
                                        }}
                                        disabled={togglingWishlistId === product._id}
                                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50 ${
                                            isInWishlist(product._id)
                                                ? "bg-red-50 text-red-500"
                                                : "bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500"
                                        }`}
                                    >
                                        {togglingWishlistId === product._id ? (
                                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Heart
                                                className={`w-5 h-5 ${
                                                    isInWishlist(product._id) ? "fill-red-500" : ""
                                                }`}
                                            />
                                        )}
                                    </button>
                                </Link>

                                {/* Product Details */}
                                <div className="p-4">
                                    <Link href={`/product/${product._id}`}>
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Material & Brand */}
                                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                                        {product.material && <span>{product.material}</span>}
                                        {product.brand && <span>• {product.brand}</span>}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-1 mt-3 text-lg font-bold text-gray-900">
                                        <IndianRupee className="w-4 h-4" />
                                        {product.price.toLocaleString("en-IN")}
                                    </div>

                                    {/* Stock Status */}
                                    <p
                                        className={`text-xs mt-1 ${
                                            product.stock && product.stock > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {product.stock && product.stock > 0
                                            ? `In Stock (${product.stock} available)`
                                            : "Out of Stock"}
                                    </p>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={
                                            addingToCartId === product._id ||
                                            (product.stock !== undefined && product.stock <= 0)
                                        }
                                        className="w-full mt-4 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingToCartId === product._id ? (
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
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
