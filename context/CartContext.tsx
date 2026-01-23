"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product, CartItem } from "@/lib/types";
import { useAuth } from "./AuthContext";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number, selectedSize?: string) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    refreshCart: () => Promise<void>;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Convert API cart item to CartItem format
    const convertApiItemToCartItem = (apiItem: any): CartItem | null => {
        const product = apiItem.product || apiItem.productId;
        if (!product) return null;
        
        return {
            _id: apiItem._id, // Cart item ID from API
            product: {
                _id: product._id,
                name: product.name,
                price: product.price || apiItem.price || 0,
                images: product.images || [],
                description: product.description,
                material: product.material,
                brand: product.brand,
                stock: product.stock,
                sizes: product.sizes || [],
            },
            quantity: apiItem.quantity || 1,
            selectedSize: apiItem.selectedSize,
        };
    };

    // Fetch cart from API
    const refreshCart = useCallback(async () => {
        if (!user?._id || !isAuthenticated) {
            setCartItems([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchApi<any>(API_ENDPOINTS.cart(user._id));
            console.log("CartContext - Cart API response:", response);

            // Handle different response structures
            let apiItems: any[] = [];
            
            if (response?.data?.items && Array.isArray(response.data.items)) {
                apiItems = response.data.items;
                console.log("CartContext - Found items in response.data.items");
            } else if (response?.data?.cart?.items && Array.isArray(response.data.cart.items)) {
                apiItems = response.data.cart.items;
                console.log("CartContext - Found items in response.data.cart.items");
            } else if (response?.data?.data?.items && Array.isArray(response.data.data.items)) {
                apiItems = response.data.data.items;
                console.log("CartContext - Found items in response.data.data.items");
            } else if (response?.data && Array.isArray(response.data)) {
                apiItems = response.data;
                console.log("CartContext - Found items in response.data (array)");
            } else if (response?.items && Array.isArray(response.items)) {
                apiItems = response.items;
                console.log("CartContext - Found items in response.items");
            } else if (Array.isArray(response)) {
                apiItems = response;
                console.log("CartContext - Found items in response (direct array)");
            } else {
                console.warn("CartContext - No items array found. Full response:", JSON.stringify(response, null, 2));
            }

            console.log("CartContext - Parsed API items:", apiItems, "Count:", apiItems.length);

            // Convert API items to CartItem format
            const convertedItems: CartItem[] = apiItems
                .map(convertApiItemToCartItem)
                .filter((item): item is CartItem => item !== null);

            console.log("CartContext - Converted cart items:", convertedItems);
            setCartItems(convertedItems);
        } catch (err) {
            console.error("CartContext - Failed to fetch cart from API:", err);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [user?._id, isAuthenticated]);

    // Load cart on mount and when user/auth changes
    useEffect(() => {
        if (isAuthenticated && user?._id) {
            refreshCart();
        } else {
            setCartItems([]);
        }
    }, [user?._id, isAuthenticated, refreshCart]);

    // Add to cart (with API sync)
    const addToCart = async (product: Product, quantity: number, selectedSize?: string) => {
        // Update local state immediately for better UX
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.product._id === product._id && item.selectedSize === selectedSize
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product._id === product._id && item.selectedSize === selectedSize
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { product, quantity, selectedSize }];
            }
        });

        // Sync with API if user is authenticated
        if (isAuthenticated && user?._id) {
            try {
                await fetchApi(API_ENDPOINTS.addToCart, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user._id,
                        productId: product._id,
                        quantity: quantity,
                        selectedSize: selectedSize,
                    }),
                });
                console.log("CartContext - Added to cart via API:", product._id);
                
                // Refresh cart from API to get updated data
                await refreshCart();
            } catch (err) {
                console.error("CartContext - Failed to add to cart via API:", err);
                // On error, revert local state change by refreshing from API
                await refreshCart();
            }
        }
    };

    // Remove from cart (with API sync)
    const removeFromCart = async (productId: string) => {
        // Find the cart item to get its _id
        const cartItem = cartItems.find((item) => item.product._id === productId);
        
        // Update local state immediately for better UX
        setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));

        // Sync with API if user is authenticated and item has _id
        if (isAuthenticated && user?._id && cartItem?._id) {
            try {
                await fetchApi(API_ENDPOINTS.removeCartItem(cartItem._id, user._id), {
                    method: "DELETE",
                });
                console.log("CartContext - Removed cart item via API:", cartItem._id);
                
                // Refresh cart from API to get updated data
                await refreshCart();
            } catch (err) {
                console.error("CartContext - Failed to remove cart item via API:", err);
                // On error, revert local state change by refreshing from API
                await refreshCart();
            }
        }
    };

    // Update quantity (with API sync)
    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        // Find the cart item to get its _id
        const cartItem = cartItems.find((item) => item.product._id === productId);
        if (!cartItem) {
            console.warn("CartContext - Item not found for update:", productId);
            return;
        }

        // Update local state immediately for better UX
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product._id === productId ? { ...item, quantity } : item
            )
        );

        // Sync with API if user is authenticated and item has _id
        if (isAuthenticated && user?._id && cartItem._id) {
            try {
                await fetchApi(API_ENDPOINTS.updateCartItem, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user._id,
                        itemId: cartItem._id,
                        productId: productId,
                        quantity: quantity,
                    }),
                });
                console.log("CartContext - Updated cart item quantity via API:", cartItem._id);
                
                // Refresh cart from API to get updated data
                await refreshCart();
            } catch (err) {
                console.error("CartContext - Failed to update cart item via API:", err);
                // On error, revert local state change by refreshing from API
                await refreshCart();
            }
        }
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Get cart total
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    // Get cart count
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                refreshCart,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
