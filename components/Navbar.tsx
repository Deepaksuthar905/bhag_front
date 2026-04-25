"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X, User, LogOut, LogIn, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { fetchApi, API_ENDPOINTS } from "@/lib/api";
import {
  catalogCacheGet,
  catalogCacheSet,
  catalogKeys,
} from "@/lib/catalog-cache";

export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const { getCartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const cartCount = getCartCount();

    // Check if current page is home page (has hero slider)
    const isHomePage = pathname === "/";

    // Debug auth state
    useEffect(() => {
        console.log("Navbar Auth State:", { isAuthenticated, isLoading, user });
    }, [isAuthenticated, isLoading, user]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-focus input when search opens
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Close search on Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && searchOpen) {
                setSearchOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [searchOpen]);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuOpen]);

    // For non-home pages, always show white background
    const shouldShowWhiteBg = !isHomePage || scrolled;
    const textColor = shouldShowWhiteBg ? "text-gray-900" : "text-white";

    // Handle search
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    // categoryId used for fetching subcategories on hover (GET /subcategories/category/:categoryId)
    const navItems: { name: string; href: string; categoryId?: string }[] = [
        { name: "Home", href: "/" },
        { name: "Hardware", href: "/hardware", categoryId: "69a1f10dc92e1e7aca7f27be" },
        { name: "Plywood", href: "/plywood", categoryId: "69a1f27ac92e1e7aca7f27e9" },
        { name: "Fevicol", href: "/fevicol", categoryId: "69a1f28ec92e1e7aca7f27f5" },
        { name: "Furniture", href: "/furniture", categoryId: "69a1f299c92e1e7aca7f27fb" },
        { name: "Handicrafts", href: "/handicraft", categoryId: "69a1f2a0c92e1e7aca7f2801" },
    ];

    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<{ _id: string; name: string; slug?: string }[]>([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleNavMouseEnter = (item: (typeof navItems)[0]) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setHoveredNav(item.name);
        if (!item.categoryId) {
            setSubcategories([]);
            return;
        }
        const cacheKey = catalogKeys.subcategoriesByCategory(item.categoryId);
        const shared = catalogCacheGet<{ _id: string; name: string; slug?: string }[]>(cacheKey);
        if (shared) {
            setSubcategories(shared);
            setLoadingSubcategories(false);
            return;
        }
        setLoadingSubcategories(true);
        setSubcategories([]);
        fetchApi<{ data?: { _id: string; name: string; slug?: string }[] }>(
            API_ENDPOINTS.subcategoriesByCategory(item.categoryId)
        )
            .then((res) => {
                const raw = res as any;
                const list = Array.isArray(raw?.data) ? raw.data
                    : Array.isArray(raw?.subcategories) ? raw.subcategories
                    : Array.isArray(raw) ? raw : [];
                catalogCacheSet(cacheKey, list);
                setSubcategories(list);
            })
            .catch(() => setSubcategories([]))
            .finally(() => setLoadingSubcategories(false));
    };

    const handleNavMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredNav(null);
            setSubcategories([]);
        }, 150);
    };

    const handleDropdownMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handleDropdownMouseLeave = () => {
        handleNavMouseLeave();
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                shouldShowWhiteBg 
                    ? "bg-white shadow-md py-4" 
                    : "bg-transparent py-6"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link
                        href="/"
                        className={`text-2xl md:text-3xl tracking-wide font-extrabold md:font-bold ${searchOpen ? "hidden md:block" : ""} block`}
                        style={{ fontFamily: "var(--font-great-vibes)" }}
                    >
                        <span className={textColor}>
                            Bhagwati
                        </span>
                    </Link>

                    {/* Desktop Menu with subcategory dropdown on hover */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative py-4"
                                onMouseEnter={() => handleNavMouseEnter(item)}
                                onMouseLeave={handleNavMouseLeave}
                            >
                                <Link
                                    href={item.href}
                                    className={`inline-flex items-center text-sm font-medium transition-colors hover:text-gray-700 font-['Inter'] ${textColor}`}
                                >
                                    {item.name}
                                </Link>
                                {/* Subcategories dropdown - show below when hovered and has categoryId */}
                                {item.categoryId && hoveredNav === item.name && (
                                    <div
                                        className="absolute left-0 top-full pt-1 min-w-[260px] max-w-[420px] z-50"
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                    >
                                        <div className={`rounded-xl shadow-lg border overflow-hidden ${
                                            shouldShowWhiteBg ? "bg-white border-gray-200" : "bg-white border-gray-200"
                                        }`}>
                                            {loadingSubcategories ? (
                                                <div className="px-4 py-6 flex justify-center">
                                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                                </div>
                                            ) : subcategories.length > 0 ? (
                                                <div className="p-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link
                                                            href={item.href}
                                                            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-100 transition-colors font-['Inter']"
                                                        >
                                                            All
                                                        </Link>
                                                        {subcategories.map((sub) => (
                                                            <Link
                                                                key={sub._id}
                                                                href={`${item.href}?subcategory=${encodeURIComponent(sub._id)}`}
                                                                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-['Inter']"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="px-4 py-3 text-sm text-gray-500 font-['Inter']">No subcategories</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className={`flex items-center ${searchOpen ? "w-full md:w-auto" : "space-x-1 sm:space-x-2 md:space-x-4"}`}>
                        {/* Search Icon / Input Field */}
                        {!searchOpen ? (
                            <button
                                onClick={() => {
                                    setSearchOpen(true);
                                    setMobileMenuOpen(false);
                                }}
                                className={`p-1.5 sm:p-2 transition-colors hover:scale-110 ${
                                    shouldShowWhiteBg
                                        ? "text-gray-900 hover:text-gray-700"
                                        : "text-white hover:text-gray-200"
                                }`}
                            >
                                <Search size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        ) : (
                            <div className={`flex items-center rounded-full border shadow-md px-3 py-1.5 animate-slideIn ${
                                shouldShowWhiteBg
                                    ? "bg-white/80 backdrop-blur-sm border-gray-300"
                                    : "bg-white/10 backdrop-blur-md border-white/30"
                            } relative w-full md:w-auto`}>
                                <Search 
                                    size={18} 
                                    className={`mr-2 flex-shrink-0 ${
                                        shouldShowWhiteBg ? "text-gray-400" : "text-white/80"
                                    }`}
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                    placeholder="Search products..."
                                    className={`outline-none text-sm w-full md:w-40 lg:w-40 bg-transparent ${
                                        shouldShowWhiteBg 
                                            ? "text-gray-900 placeholder-gray-400" 
                                            : "text-white placeholder-white/60"
                                    }`}
                                />
                                <button
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className={`ml-2 p-1 transition-colors flex-shrink-0 ${
                                        shouldShowWhiteBg 
                                            ? "text-gray-400 hover:text-gray-600" 
                                            : "text-white/80 hover:text-white"
                                    }`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        {!searchOpen && (
                            <>
                                <button
                                    onClick={() => router.push("/wishlist")}
                                    className={`p-1.5 sm:p-2 transition-colors hover:scale-110 relative ${
                                        shouldShowWhiteBg
                                            ? "text-gray-900 hover:text-gray-700"
                                            : "text-white hover:text-gray-200"
                                    }`}
                                >
                                    <Heart size={18} className="sm:w-5 sm:h-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {wishlistCount > 9 ? "9+" : wishlistCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => router.push("/cart")}
                                    className={`p-1.5 sm:p-2 transition-colors hover:scale-110 relative ${
                                        shouldShowWhiteBg
                                            ? "text-gray-900 hover:text-gray-700"
                                            : "text-white hover:text-gray-200"
                                    }`}
                                >
                                    <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {cartCount > 9 ? "9+" : cartCount}
                                        </span>
                                    )}
                                </button>
                                
                                {/* User Icon with Dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(!userMenuOpen);
                                            setMobileMenuOpen(false);
                                            setSearchOpen(false);
                                        }}
                                        className={`p-1.5 sm:p-2 transition-colors hover:scale-110 relative ${
                                            shouldShowWhiteBg
                                                ? "text-gray-900 hover:text-gray-700"
                                                : "text-white hover:text-gray-200"
                                        }`}
                                    >
                                        <User size={18} className="sm:w-5 sm:h-5" />
                                        {isAuthenticated && (
                                            <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {userMenuOpen && (
                                <div className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slideDown z-50 ${
                                    shouldShowWhiteBg ? "" : "md:bg-white"
                                }`}>
                                    {isLoading ? (
                                        <div className="px-4 py-3 text-center">
                                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto"></div>
                                        </div>
                                    ) : isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                                <p className="text-sm font-semibold text-gray-900 font-['Inter']">
                                                    Welcome, {user?.name || "User"}!
                                                </p>
                                                <p className="text-xs text-gray-600 font-['Inter']">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            <div className="py-2">
                                                <a
                                                    href="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-['Inter']"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <UserCircle size={18} className="mr-3" />
                                                    My Profile
                                                </a>
                                                <a
                                                    href="/orders"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-['Inter']"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <ShoppingBag size={18} className="mr-3" />
                                                    My Orders
                                                </a>
                                                <div className="border-t border-gray-200 my-1"></div>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setUserMenuOpen(false);
                                                        router.push("/");
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-['Inter'] text-left"
                                                >
                                                    <LogOut size={18} className="mr-3" />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-2">
                                            <a
                                                href="/login"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-['Inter']"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <LogIn size={18} className="mr-3" />
                                                Login
                                            </a>
                                            <a
                                                href="/register"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-['Inter']"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <UserCircle size={18} className="mr-3" />
                                                Sign Up
                                            </a>
                                        </div>
                                    )}
                                </div>
                                    )}
                                </div>
                                
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className={`md:hidden p-1.5 sm:p-2 transition-colors ${textColor}`}
                                >
                                    {mobileMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg absolute w-full mt-4 animate-in slide-in-from-top">
                    <div className="px-4 py-6 space-y-4">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block text-gray-900 hover:text-gray-600 font-medium font-['Inter']"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slideIn {
                    animation: slideIn 0.2s ease-out;
                }

                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </nav>
    );
}
