"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    ChevronRight,
    MapPin,
    Calendar,
    IndianRupee,
    ShoppingBag,
    Search,
    Filter,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi, API_ENDPOINTS, API_BASE_URL } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

// Order item interface (product may be populated object or just id string)
interface OrderItem {
    _id?: string;
    product: {
        _id: string;
        name?: string;
        price?: number;
        images?: string[];
    } | string;
    quantity: number;
    price: number;
    selectedSize?: string;
}

// Order interface (backend may use total or totalAmount)
interface Order {
    _id: string;
    userId?: string;
    user?: string;
    items?: OrderItem[];
    totalAmount?: number;
    total?: number;
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    shippingAddress?: {
        name?: string;
        fullName?: string;
        phone?: string;
        addressLine1?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
    paymentMethod?: string;
    paymentStatus?: string;
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
}

// Status config
const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: Package },
    shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800", icon: Truck },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function OrdersPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    
    // State
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login?redirect=/orders");
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?._id) return;
            
            setIsLoading(true);
            setError("");
            
            try {
                const response = await fetchApi<any>(
                    API_ENDPOINTS.orders(user._id)
                );
                console.log("Orders response:", response);

                let ordersData: Order[] = [];
                const raw = response as any;
                if (raw?.data?.orders && Array.isArray(raw.data.orders)) {
                    ordersData = raw.data.orders;
                } else if (raw?.data?.data && Array.isArray(raw.data.data)) {
                    ordersData = raw.data.data;
                } else if (Array.isArray(raw?.data)) {
                    ordersData = raw.data;
                } else if (Array.isArray(raw?.orders)) {
                    ordersData = raw.orders;
                } else if (Array.isArray(raw)) {
                    ordersData = raw;
                }

                setOrders(Array.isArray(ordersData) ? ordersData : []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("Failed to load orders. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && user?._id) {
            fetchOrders();
        }
    }, [user?._id, isAuthenticated]);

    // Get product image (images can be string[] or single string path)
    const getProductImage = (images?: string[] | string): string => {
        if (!images) return "/placeholder.svg";
        const img = Array.isArray(images) ? images[0] : images;
        if (!img) return "/placeholder.svg";
        if (img.startsWith("http")) return img;
        const base = API_BASE_URL.replace("/api", "");
        if (img.startsWith("/")) return base + img;
        return `${base}/uploads/${img}`;
    };

    // Format date
    const formatDate = (dateString?: string): string => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === "all" || (order.status && order.status === filterStatus);
        const itemList = order.items || [];
        const matchesSearch = searchQuery === "" ||
            (order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
            itemList.some(item => {
                const p = item.product;
                const name = typeof p === "object" && p ? p.name : "";
                return name && name.toLowerCase().includes(searchQuery.toLowerCase());
            });
        return matchesStatus && matchesSearch;
    });

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Back Button */}
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Profile</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-600 mt-1">Track and manage your orders</p>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none w-full sm:w-64 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            {/* Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none appearance-none bg-white text-gray-900"
                                >
                                    <option value="all">All Orders</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Loading */}
                {isLoading && (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading orders...</p>
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
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

                {/* Empty Orders */}
                {!isLoading && !error && filteredOrders.length === 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {orders.length === 0 ? "No orders yet" : "No orders found"}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {orders.length === 0 
                                ? "Looks like you haven't placed any orders yet."
                                : "Try adjusting your search or filter."}
                        </p>
                        {orders.length === 0 && (
                            <Link
                                href="/hardware"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Start Shopping
                            </Link>
                        )}
                    </div>
                )}

                {/* Orders List */}
                {!isLoading && !error && filteredOrders.length > 0 && (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const orderStatus = order.status || "pending";
                            const status = statusConfig[orderStatus] || statusConfig.pending;
                            const StatusIcon = status.icon;
                            const itemList = order.items || [];
                            const totalDisplay = order.total ?? order.totalAmount;
                            const firstProduct = itemList[0]?.product;
                            const firstProductId = typeof firstProduct === "string" ? firstProduct : (firstProduct as { _id?: string })?._id;

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="p-5 border-b border-gray-200 bg-gray-50">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-4">
                                                {/* Order ID */}
                                                <div>
                                                    <p className="text-xs text-gray-500">Order ID</p>
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        #{order._id ? String(order._id).slice(-8).toUpperCase() : "—"}
                                                    </p>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {formatDate(order.createdAt || order.created_at)}
                                                    </span>
                                                </div>

                                                {/* Total */}
                                                <div className="flex items-center gap-1 text-gray-900 font-semibold">
                                                    <IndianRupee className="w-4 h-4" />
                                                    <span>{totalDisplay != null ? Number(totalDisplay).toLocaleString("en-IN") : "N/A"}</span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {status.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-5">
                                        <div className="space-y-4">
                                            {itemList.slice(0, 3).map((item, idx) => {
                                                const product = typeof item.product === "object" ? item.product : null;
                                                const productName = product?.name ?? "Product";
                                                const productImages = product?.images ?? undefined;
                                                return (
                                                    <div key={item._id || idx} className="flex gap-4">
                                                        {/* Product Image - use img to avoid Next/Image domain config with API URLs */}
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={getProductImage(productImages)}
                                                                alt={productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-gray-900 line-clamp-1">
                                                                {productName}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                                                                <span>Qty: {item.quantity}</span>
                                                                {item.selectedSize && (
                                                                    <span>Size: {item.selectedSize}</span>
                                                                )}
                                                                <span className="font-medium text-gray-900">
                                                                    ₹{Number(item.price ?? 0).toLocaleString("en-IN")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {itemList.length > 3 && (
                                                <p className="text-sm text-gray-500">
                                                    +{itemList.length - 3} more item(s)
                                                </p>
                                            )}
                                        </div>

                                        {/* Shipping Address */}
                                        {order.shippingAddress && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <p>
                                                        <span className="font-medium text-gray-900">
                                                            {order.shippingAddress.name || order.shippingAddress.fullName}
                                                        </span>
                                                        {order.shippingAddress.addressLine1 && (
                                                            <> - {order.shippingAddress.addressLine1}</>
                                                        )}
                                                        {order.shippingAddress.city && (
                                                            <>, {order.shippingAddress.city}</>
                                                        )}
                                                        {order.shippingAddress.pincode && (
                                                            <> - {order.shippingAddress.pincode}</>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Footer - View Details goes to first product's page */}
                                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            {itemList.length} item(s) • {order.paymentMethod || "COD"}
                                        </p>
                                        <Link
                                            href={firstProductId ? `/product/${firstProductId}` : "#"}
                                            className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                                        >
                                            View Details
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
