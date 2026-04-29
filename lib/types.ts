// Shared Product Types

export interface ProductSize {
    _id?: string;
    label?: string;
    value?: string;
    name?: string;
    id?: string;
    /** Per-size price override (variant rows). */
    price?: number;
    stock?: number;
}

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
    sizes?: ProductSize[];
    material?: string;
    brand?: string;
    unit?: string;
    stock?: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
    /** Parent listing product id when this row is a color/SKU variant. */
    parentProduct?: string | null;
    color?: string;
    /** Store listing: number of child variant products. */
    variantCount?: number;
    priceMin?: number;
    priceMax?: number;
}

/** GET /product/:id enriched payload (adds root + colour variant rows) */
export interface ProductDetailPayload extends Product {
    root?: Product;
    listingRootId?: string;
    isVariant?: boolean;
    colorVariants?: Product[];
}

export interface CartItem {
    _id?: string; // Cart item ID from API
    product: Product;
    quantity: number;
    selectedSize?: string;
    /** Unit price captured for the selected size at add-to-cart time. */
    price?: number;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}
