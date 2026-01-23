// Shared Product Types

export interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    images: string[];
    category?: {
        _id: string;
        name: string;
    } | null;
    sizes?: {
        _id: string;
        label?: string;
        value?: string;
    }[];
    material?: string;
    brand?: string;
    unit?: string;
    stock?: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CartItem {
    _id?: string; // Cart item ID from API
    product: Product;
    quantity: number;
    selectedSize?: string;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}
