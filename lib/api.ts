// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";

// API Endpoints
export const API_ENDPOINTS = {
    // Product endpoints (uses /api prefix)
    products: "/products",
    productById: (id: string) => `/product/${id}`,
    productsByCategory: (categoryId: string) => `/products/category/${categoryId}`,
    subcategoriesByCategory: (categoryId: string) => `/subcategories/category/${categoryId}`,
    // Cart endpoints
    cart: (userId: string) => `/cart/?userId=${userId}`,
    addToCart: "/cart/add",
    updateCartItem: "/cart/update",
    removeCartItem: (itemId: string, userId: string) => `/cart/remove/${itemId}?userId=${userId}`,
    // Address endpoints
    addresses: (userId: string) => `/address/?userId=${userId}`,
    addAddress: "/address/add",
    updateAddress: (id: string) => `/address/update/${id}`,
    deleteAddress: (id: string, userId: string) => `/address/delete/${id}?userId=${userId}`,
    // Order endpoints
    orders: (userId: string) => `/orders/?userId=${userId}`,
    // Wishlist endpoints
    wishlist: (userId: string) => `/wishlist/?userId=${userId}`,
    addToWishlist: "/wishlist/add",
    removeFromWishlist: (productId: string, userId: string) => `/wishlist/remove/${productId}?userId=${userId}`,
    // Search endpoint
    search: (query: string) => `/search?q=${encodeURIComponent(query)}`,
};

// Auth Endpoints (no /api prefix)
export const AUTH_ENDPOINTS = {
    login: "/login",
    register: "/register",
};

// Helper function to build full API URL
export const getApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};

// Helper function to build full Auth URL
export const getAuthUrl = (endpoint: string): string => {
    return `${AUTH_BASE_URL}${endpoint}`;
};

// Generic fetch wrapper with error handling
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = getApiUrl(endpoint);
    
    const { headers, ...restOptions } = options || {};
    
    const response = await fetch(url, {
        ...restOptions,
        headers: {
            "Content-Type": "application/json",
            ...(headers as Record<string, string>),
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// Auth fetch wrapper (for login, register - no /api prefix)
export async function fetchAuth<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = getAuthUrl(endpoint);
    
    const { headers, ...restOptions } = options || {};
    
    const response = await fetch(url, {
        ...restOptions,
        headers: {
            "Content-Type": "application/json",
            ...(headers as Record<string, string>),
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Auth Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
