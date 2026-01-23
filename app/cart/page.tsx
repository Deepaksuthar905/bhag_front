"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ShoppingCart,
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
    ArrowLeft,
    Package,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/lib/types";

export default function CartPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { cartItems, updateQuantity, removeFromCart, isLoading: cartLoading } = useCart();
    const [error, setError] = useState("");

    // Get product image
    const getProductImage = (images: string[]): string => {
        if (!images || images.length === 0) return "/placeholder.jpg";
        const image = images[0];
        return image.startsWith("http") ? image : `/${image}`;
    };

    // Format price
    const formatPrice = (price: number): string => {
        return `₹${price.toLocaleString("en-IN")}`;
    };

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + price * item.quantity;
    }, 0);

    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    const total = subtotal + shipping;

    // Handle quantity change (context with API sync)
    const handleQuantityChange = async (productId: string, delta: number) => {
        const item = cartItems.find((cartItem) => cartItem.product._id === productId);
        if (!item) return;
        const newQuantity = Math.max(1, item.quantity + delta);
        await updateQuantity(productId, newQuantity);
    };

    // Handle remove item (context with API sync)
    const handleRemoveItem = async (productId: string) => {
        await removeFromCart(productId);
    };

    // Handle order
    const handlePlaceOrder = () => {
        // TODO: Implement order placement
        router.push("/checkout");
    };

    // Show login prompt if not authenticated
    if (!authLoading && !isAuthenticated) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-10 h-10 text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
                            Please Login to View Cart
                        </h1>
                        <p className="text-gray-600 mb-8 font-['Inter']">
                            You need to be logged in to view your cart and place orders.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/login"
                                className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (cartLoading || authLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                        <span className="ml-3 text-gray-600 font-medium">Loading cart...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
                            Error Loading Cart
                        </h1>
                        <p className="text-gray-600 mb-8 font-['Inter']">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
                            Your Cart is Empty
                        </h1>
                        <p className="text-gray-600 mb-8 font-['Inter']">
                            Looks like you haven&apos;t added any items to your cart yet.
                        </p>
                        <Link
                            href="/hardware"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Poppins']">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 mt-2 font-['Inter']">
                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const product = item.product;

                            return (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6"
                            >
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={getProductImage(product.images || [])}
                                            alt={product.name || "Product"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg font-['Inter'] line-clamp-2">
                                                    {product.name || "Product"}
                                                </h3>
                                                {product.material && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Material: {product.material}
                                                    </p>
                                                )}
                                                {product.brand && (
                                                    <p className="text-sm text-gray-500">
                                                        Brand: {product.brand}
                                                    </p>
                                                )}
                                                {item.selectedSize && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Size: {item.selectedSize}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(product._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Price and Quantity */}
                                        <div className="flex items-end justify-between mt-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantityChange(product._id, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="w-10 text-center font-semibold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(product._id, 1)}
                                                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatPrice((product.price || 0) * item.quantity)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatPrice(product.price || 0)} each
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Poppins']">
                                Order Summary
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium text-gray-900">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-gray-900">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            formatPrice(shipping)
                                        )}
                                    </span>
                                </div>
                                {subtotal < 500 && (
                                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                        Add {formatPrice(500 - subtotal)} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                className="w-full mt-6 py-4 bg-gray-800 text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Package className="w-5 h-5" />
                                Order Now
                            </button>

                            {/* Continue Shopping */}
                            <Link
                                href="/hardware"
                                className="block w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Free Returns within 7 days</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Cash on Delivery Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
