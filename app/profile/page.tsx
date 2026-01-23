"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    Heart,
    LogOut,
    Edit2,
    ChevronRight,
    Package,
    Shield,
    Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

// Address interface
interface Address {
    _id: string;
    name?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    addressLine1?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    
    // State
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "addresses" | "orders">("overview");
    const [wishlistCount, setWishlistCount] = useState(0);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login?redirect=/profile");
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user?._id) return;
            
            setIsLoadingAddresses(true);
            try {
                const response = await fetchApi<ApiResponse<Address[]>>(
                    API_ENDPOINTS.addresses(user._id)
                );
                setAddresses(response.data || []);
            } catch (err) {
                console.error("Failed to fetch addresses:", err);
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        if (isAuthenticated && user?._id) {
            fetchAddresses();
        }
    }, [user?._id, isAuthenticated]);

    // Load wishlist count
    useEffect(() => {
        if (user?._id) {
            const savedWishlist = localStorage.getItem(`wishlist_${user._id}`);
            if (savedWishlist) {
                const wishlist = JSON.parse(savedWishlist);
                setWishlistCount(wishlist.length);
            }
        }
    }, [user?._id]);

    // Handle logout
    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    // Get user initials for avatar
    const getInitials = () => {
        if (user.name) {
            const names = user.name.split(" ");
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        return user.email.substring(0, 2).toUpperCase();
    };

    // Menu items
    const menuItems = [
        { icon: ShoppingBag, label: "My Orders", href: "/orders", description: "Track, return or buy again" },
        { icon: Heart, label: "Wishlist", href: "/wishlist", description: "Your saved items" },
        { icon: MapPin, label: "Addresses", href: "/checkout", description: "Manage delivery addresses" },
    ];

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                                {getInitials()}
                            </div>
                            <button className="absolute bottom-0 right-0 w-9 h-9 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold mb-1">
                                {user.name || "User"}
                            </h1>
                            <p className="text-gray-300 mb-4">{user.email}</p>
                            
                            {/* Quick Stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-gray-400">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{wishlistCount}</p>
                                    <p className="text-gray-400">Wishlist</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{addresses.length}</p>
                                    <p className="text-gray-400">Addresses</p>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - User Details */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Personal Information</h2>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Name */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
                                        <p className="font-medium text-gray-900">{user.name || "Not provided"}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
                                        <p className="font-medium text-gray-900">{user.email}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
                                        <p className="font-medium text-gray-900">{user.phone || "Not provided"}</p>
                                    </div>
                                </div>

                                {/* User ID */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">User ID</p>
                                        <p className="font-medium text-gray-900 text-sm break-all">{user._id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>

                    {/* Right Column - Menu & Addresses */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions Menu */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-200">
                                <h2 className="font-semibold text-gray-900">Quick Actions</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Saved Addresses */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Saved Addresses</h2>
                                <Link
                                    href="/checkout"
                                    className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Manage
                                </Link>
                            </div>
                            
                            {isLoadingAddresses ? (
                                <div className="p-8 text-center">
                                    <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 mb-4">No addresses saved yet</p>
                                    <Link
                                        href="/checkout"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                                    >
                                        Add Address
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {addresses.slice(0, 3).map((address, index) => (
                                        <div key={address._id || index} className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900">
                                                        {address.name || address.fullName || "Address"}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-0.5">
                                                        {address.addressLine1 || address.address || ""}
                                                        {address.city && `, ${address.city}`}
                                                        {address.state && `, ${address.state}`}
                                                        {address.pincode && ` - ${address.pincode}`}
                                                    </p>
                                                    {address.phone && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {address.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {addresses.length > 3 && (
                                        <Link
                                            href="/checkout"
                                            className="block p-4 text-center text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                                        >
                                            View all {addresses.length} addresses
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Recent Orders Placeholder */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                                <Link
                                    href="/orders"
                                    className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-600 mb-4">No orders yet</p>
                                <Link
                                    href="/hardware"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
