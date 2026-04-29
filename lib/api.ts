import { dedupeGet } from "./fetch-dedupe";

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-jc8p.onrender.com/api";
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "https://backend-jc8p.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
    // Product endpoints (uses /api prefix)
    products: "/products",
    productById: (id: string) => `/product/${id}`,
    /** Root products only + variant counts (Flipkart-style listing). */
    productsByCategory: (categoryId: string) =>
        `/products/category/${categoryId}?groupVariants=1`,
    subcategoriesByCategory: (categoryId: string) => `/subcategories/category/${categoryId}`,
    subcategoryById: (id: string) => `/subcategory/${id}?groupVariants=1`,
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
    orderCreate: "/orders/create",
    uploadScreenshot: "/orders/upload-screenshot",
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

async function fetchApiOnce<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
        const errorData = await response.json().catch(() => ({})) as Record<string, unknown>;
        const message =
            typeof errorData?.message === "string" ? errorData.message
            : typeof errorData?.error === "string" ? errorData.error
            : typeof errorData?.msg === "string" ? errorData.msg
            : typeof errorData?.errorMessage === "string" ? errorData.errorMessage
            : null;
        const errMsg = message || `API Error: ${response.status} ${response.statusText}`;
        // When API returns "products not found" / "no products for category", treat as empty list so UI shows empty state instead of error
        if (response.status === 404 && message && /products?\s*not\s*found|no\s*products|not\s*found\s*for\s*this\s*category/i.test(message)) {
            return [] as T;
        }
        throw new Error(errMsg);
    }

    return response.json();
}

/** GET requests with the same endpoint share one in-flight request (avoids duplicate calls from Strict Mode / multiple components). */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const method = (options?.method || "GET").toUpperCase();
    if (method === "GET") {
        return dedupeGet(`GET:${endpoint}`, () => fetchApiOnce<T>(endpoint, options));
    }
    return fetchApiOnce<T>(endpoint, options);
}

// Upload file (e.g. screenshot) - FormData, no Content-Type (browser sets multipart boundary)
export async function uploadApiFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
        method: "POST",
        body: formData,
        // Do not set Content-Type; browser sets multipart/form-data with boundary
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as Record<string, unknown>;
        const message =
            typeof errorData?.message === "string" ? errorData.message
            : typeof errorData?.error === "string" ? errorData.error
            : typeof errorData?.msg === "string" ? errorData.msg
            : typeof errorData?.errorMessage === "string" ? errorData.errorMessage
            : null;
        throw new Error(message || `API Error: ${response.status} ${response.statusText}`);
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
        const errorData = await response.json().catch(() => ({})) as Record<string, unknown>;
        const message =
            typeof errorData?.message === "string" ? errorData.message
            : typeof errorData?.error === "string" ? errorData.error
            : typeof errorData?.msg === "string" ? errorData.msg
            : typeof errorData?.errorMessage === "string" ? errorData.errorMessage
            : null;
        throw new Error(message || `Auth Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
