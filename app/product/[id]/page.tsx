"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Heart,
    ShoppingCart,
    Minus,
    Plus,
    ChevronLeft,
    Package,
    Truck,
    Shield,
    Check,
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Product, ApiResponse } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { isInWishlist: checkIsInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [wishlistAnimation, setWishlistAnimation] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
    
    // Check if current product is in wishlist
    const isInWishlist = product ? checkIsInWishlist(product._id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await fetchApi<ApiResponse<Product>>(`/product/${params.id}`);
                setProduct(response.data);
                // Set default size if available (API may send value, label, or name)
                if (response.data.sizes && response.data.sizes.length > 0) {
                    const first = response.data.sizes[0] as { value?: string; label?: string; name?: string };
                    setSelectedSize(first.value || first.label || first.name || "");
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    // Toggle wishlist using context
    const handleToggleWishlist = async () => {
        if (!isAuthenticated || !user?._id) {
            setShowLoginPrompt(true);
            return;
        }

        if (!product || isTogglingWishlist) return;

        setWishlistAnimation(true);
        setIsTogglingWishlist(true);

        try {
            if (isInWishlist) {
                await removeFromWishlist(product._id);
                console.log("Removed from wishlist");
            } else {
                await addToWishlist(product._id);
                console.log("Added to wishlist");
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        } finally {
            setIsTogglingWishlist(false);
            setTimeout(() => setWishlistAnimation(false), 300);
        }
    };

    const getProductImage = (imagePath: string): string => {
        if (!imagePath) return "/placeholder.jpg";
        return imagePath.startsWith("http") ? imagePath : `/${imagePath}`;
    };

    const formatPrice = (price: number): string => {
        return `₹${price.toLocaleString("en-IN")}`;
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        // Check if user is logged in
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        setIsAddingToCart(true);
        
        try {
            // Add to cart (now syncs with API)
            await addToCart(product, quantity, selectedSize);
            
            // Show success feedback
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (err) {
            console.error("Failed to add to cart:", err);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleLoginRedirect = () => {
        // Store current page to redirect back after login
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Skeleton */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
                            <div className="flex gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                        {/* Details Skeleton */}
                        <div className="space-y-6">
                            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</h1>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Products</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            {product.stock && product.stock > 0 && (
                                <span className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 text-sm font-bold rounded-full z-10 shadow-lg">
                                    In Stock
                                </span>
                            )}
                            <button 
                                onClick={handleToggleWishlist}
                                className={`absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-red-50 transition-all z-10 ${
                                    wishlistAnimation ? "scale-125" : ""
                                }`}
                            >
                                <Heart 
                                    className={`w-6 h-6 transition-colors ${
                                        isInWishlist 
                                            ? "text-red-500 fill-red-500" 
                                            : "text-gray-400 hover:text-red-500"
                                    }`} 
                                />
                            </button>
                            <img
                                src={getProductImage(images[selectedImage])}
                                alt={product.name}
                                className="w-full h-full object-contain p-4"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                }}
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === index
                                                ? "border-gray-700 shadow-md"
                                                : "border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        <img
                                            src={getProductImage(img)}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Category */}
                        {product.category && (
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full uppercase tracking-wide">
                                {product.category.name}
                            </span>
                        )}

                        {/* Product Name */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-gray-700">
                                {formatPrice(product.price)}
                            </span>
                            {product.unit && (
                                <span className="text-gray-500">per {product.unit}</span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* Product Info */}
                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                            {product.material && (
                                <div>
                                    <span className="text-sm text-gray-500">Material</span>
                                    <p className="font-semibold text-gray-800">{product.material}</p>
                                </div>
                            )}
                            {product.brand && (
                                <div>
                                    <span className="text-sm text-gray-500">Brand</span>
                                    <p className="font-semibold text-gray-800">{product.brand}</p>
                                </div>
                            )}
                            {product.stock !== undefined && (
                                <div>
                                    <span className="text-sm text-gray-500">Available Stock</span>
                                    <p className="font-semibold text-gray-800">{product.stock} {product.unit || "pieces"}</p>
                                </div>
                            )}
                        </div>

                        {/* Size Selection - API sends sizes as [{ name: "1" }, { name: "2" }, ...] */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Select Size
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size: { _id?: string; value?: string; label?: string; name?: string }, idx: number) => {
                                        const sizeValue = size.value || size.label || size.name || "";
                                        const displayName = size.name || size.label || size.value || sizeValue;
                                        return (
                                            <button
                                                key={size._id ?? `size-${idx}`}
                                                onClick={() => setSelectedSize(sizeValue)}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                                    selectedSize === sizeValue
                                                        ? "border-gray-700 bg-gray-700 text-white"
                                                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                                                }`}
                                            >
                                                {displayName}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <span className="w-16 text-center font-bold text-lg text-gray-800">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= (product.stock || 99)}
                                        className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                                <span className="text-gray-500">
                                    Total: <span className="font-bold text-gray-800">{formatPrice(product.price * quantity)}</span>
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || (product.stock !== undefined && product.stock <= 0)}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                                    addedToCart
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-800 text-white hover:bg-gray-900 shadow-lg hover:shadow-xl"
                                }`}
                            >
                                {isAddingToCart ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : addedToCart ? (
                                    <>
                                        <Check className="w-6 h-6" />
                                        Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-6 h-6" />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Package className="w-8 h-8 text-gray-600" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Quality Product</p>
                                    <p className="text-xs text-gray-500">Premium materials</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Truck className="w-8 h-8 text-gray-600" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Fast Delivery</p>
                                    <p className="text-xs text-gray-500">2-5 business days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <Shield className="w-8 h-8 text-gray-600" />
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">Secure Payment</p>
                                    <p className="text-xs text-gray-500">100% protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Required Modal */}
            {showLoginPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
                            <p className="text-gray-600 mb-6">
                                Please login to add items to your cart and place orders.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLoginRedirect}
                                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                                >
                                    Login
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                Don&apos;t have an account?{" "}
                                <button
                                    onClick={() => router.push("/register")}
                                    className="text-gray-700 font-semibold hover:underline"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
