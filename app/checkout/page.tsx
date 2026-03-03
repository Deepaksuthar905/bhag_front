"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Phone,
    User,
    Mail,
    CreditCard,
    Truck,
    Wallet,
    CheckCircle,
    AlertCircle,
    Loader2,
    ShoppingBag,
    Package,
    Shield,
    Plus,
    Edit2,
    X,
    Check,
    Trash2,
} from "lucide-react";
import { fetchApi, uploadApiFile, API_ENDPOINTS } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ApiResponse } from "@/lib/types";

// Shipping address interface
interface ShippingAddress {
    _id?: string;
    fullName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
}

// Address from API
interface AddressFromAPI {
    _id: string;
    userId: string;
    fullName?: string;
    name?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    addressLine1?: string;
    address?: string;
    street?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    zipcode?: string;
    landmark?: string;
}

// Cache key for addresses
const ADDRESSES_CACHE_KEY = "cached_addresses_";
const ADDRESSES_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Payment method type - only COD or QR Scan
type PaymentMethod = "cod" | "qr";

// UPI ID for QR Scan payments
const UPI_ID = "8949599717@ptsbi";
const UPI_PAYEE_NAME = "Deepak Suthar";

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    // Cart state
    const { cartItems, isLoading: cartLoading } = useCart();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Form state
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: "",
        phone: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    });

    // Payment state (cod or qr only)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
    // Payment screenshot when QR Scan is selected (to be sent to API later)
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

    // Order state
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState("");

    // Address management state
    const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
    const [addressesLoaded, setAddressesLoaded] = useState(false);
    const [newAddress, setNewAddress] = useState<ShippingAddress>({
        fullName: "",
        phone: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    });

    // Convert API address to ShippingAddress format
    const convertApiAddress = (apiAddr: AddressFromAPI): ShippingAddress => {
        return {
            _id: apiAddr._id,
            fullName: apiAddr.fullName || apiAddr.name || "",
            phone: apiAddr.phone || apiAddr.mobile || "",
            email: apiAddr.email || "",
            addressLine1: apiAddr.addressLine1 || apiAddr.address || apiAddr.street || "",
            addressLine2: apiAddr.addressLine2 || "",
            city: apiAddr.city || "",
            state: apiAddr.state || "",
            pincode: apiAddr.pincode || apiAddr.zipcode || "",
            landmark: apiAddr.landmark || "",
        };
    };

    // Check if cache is valid
    const isCacheValid = (userId: string): boolean => {
        const cacheTime = localStorage.getItem(`${ADDRESSES_CACHE_KEY}${userId}_time`);
        if (!cacheTime) return false;
        return Date.now() - parseInt(cacheTime) < ADDRESSES_CACHE_EXPIRY;
    };

    // Get cached addresses
    const getCachedAddresses = (userId: string): ShippingAddress[] | null => {
        if (!isCacheValid(userId)) return null;
        const cached = localStorage.getItem(`${ADDRESSES_CACHE_KEY}${userId}`);
        if (!cached) return null;
        try {
            return JSON.parse(cached);
        } catch {
            return null;
        }
    };

    // Save addresses to cache
    const cacheAddresses = (userId: string, addresses: ShippingAddress[]) => {
        localStorage.setItem(`${ADDRESSES_CACHE_KEY}${userId}`, JSON.stringify(addresses));
        localStorage.setItem(`${ADDRESSES_CACHE_KEY}${userId}_time`, Date.now().toString());
    };

    // Fetch cart and addresses
    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) return;

            try {
                setIsLoading(true);


                // Check if addresses are already loaded or cached
                if (!addressesLoaded) {
                    const cachedAddresses = getCachedAddresses(user._id);

                    if (cachedAddresses && cachedAddresses.length > 0) {
                        // Use cached addresses
                        console.log("Using cached addresses");
                        setSavedAddresses(cachedAddresses);
                        setShippingAddress(cachedAddresses[0]);
                        setAddressesLoaded(true);
                    } else {
                        // Fetch from API
                        console.log("Fetching addresses from API");
                        try {
                            const addressResponse = await fetchApi<ApiResponse<AddressFromAPI[]>>(
                                API_ENDPOINTS.addresses(user._id)
                            );

                            console.log("Address API response:", addressResponse);

                            const apiAddresses = addressResponse.data || [];

                            if (apiAddresses.length > 0) {
                                // Convert API addresses to our format
                                const convertedAddresses = apiAddresses.map(convertApiAddress);
                                setSavedAddresses(convertedAddresses);
                                setShippingAddress(convertedAddresses[0]);
                                cacheAddresses(user._id, convertedAddresses);
                            } else {
                                // No addresses from API, create default from user info
                                const defaultAddress: ShippingAddress = {
                                    fullName: user.name || "",
                                    phone: user.phone || "",
                                    email: user.email || "",
                                    addressLine1: "",
                                    addressLine2: "",
                                    city: "",
                                    state: "",
                                    pincode: "",
                                    landmark: "",
                                };
                                setSavedAddresses([defaultAddress]);
                                setShippingAddress(defaultAddress);
                            }
                            setAddressesLoaded(true);
                        } catch (addrErr) {
                            console.error("Failed to fetch addresses:", addrErr);
                            // Fallback to default address
                            const defaultAddress: ShippingAddress = {
                                fullName: user.name || "",
                                phone: user.phone || "",
                                email: user.email || "",
                                addressLine1: "",
                                addressLine2: "",
                                city: "",
                                state: "",
                                pincode: "",
                                landmark: "",
                            };
                            setSavedAddresses([defaultAddress]);
                            setShippingAddress(defaultAddress);
                            setAddressesLoaded(true);
                        }
                    }
                }

                // Pre-fill new address form with user info
                setNewAddress(prev => ({
                    ...prev,
                    fullName: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                }));

            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading && isAuthenticated && user) {
            fetchData();
        } else if (!authLoading && !isAuthenticated) {
            setIsLoading(false);
        }
    }, [user?._id, isAuthenticated, authLoading, user, addressesLoaded]);

    // Handle input change for new address form
    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    // State for saving address
    const [isSavingAddress, setIsSavingAddress] = useState(false);

    // Save new address
    const handleSaveAddress = async () => {
        // Validate required fields
        const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
        for (const field of required) {
            if (!newAddress[field as keyof ShippingAddress]) {
                setError(`Please fill ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
                return;
            }
        }
        if (newAddress.phone.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }
        if (newAddress.pincode.length !== 6) {
            setError("Please enter a valid 6-digit pincode");
            return;
        }

        setError("");
        setIsSavingAddress(true);

        let updatedAddresses: ShippingAddress[];

        try {
            if (editingAddressIndex !== null && newAddress._id) {
                // Update existing address via API
                console.log("Updating address:", newAddress._id);

                const updatePayload = {
                    userId: user?._id,
                    name: newAddress.fullName,
                    phone: newAddress.phone,
                    email: newAddress.email,
                    addressLine1: newAddress.addressLine1,
                    addressLine2: newAddress.addressLine2,
                    city: newAddress.city,
                    state: newAddress.state,
                    pincode: newAddress.pincode,
                    landmark: newAddress.landmark,
                };

                await fetchApi(API_ENDPOINTS.updateAddress(newAddress._id), {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatePayload),
                });

                console.log("Address updated successfully");

                // Update local state
                updatedAddresses = [...savedAddresses];
                updatedAddresses[editingAddressIndex] = newAddress;
                setSelectedAddressIndex(editingAddressIndex);
            } else {
                // Add new address via API
                console.log("Adding new address");

                const addPayload = {
                    userId: user?._id,
                    name: newAddress.fullName,
                    phone: newAddress.phone,
                    email: newAddress.email,
                    addressLine1: newAddress.addressLine1,
                    addressLine2: newAddress.addressLine2,
                    city: newAddress.city,
                    state: newAddress.state,
                    pincode: newAddress.pincode,
                    landmark: newAddress.landmark,
                };

                const response = await fetchApi<ApiResponse<{ _id: string }>>(API_ENDPOINTS.addAddress, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(addPayload),
                });

                console.log("Address added successfully:", response);

                // Add the new address with _id from response
                const addedAddress: ShippingAddress = {
                    ...newAddress,
                    _id: response.data?._id || (response as any)._id || "",
                };

                updatedAddresses = [...savedAddresses, addedAddress];
                setSelectedAddressIndex(updatedAddresses.length - 1);
            }

            setSavedAddresses(updatedAddresses);
            setShippingAddress(newAddress);

            // Update cache
            if (user?._id) {
                cacheAddresses(user._id, updatedAddresses);
            }

            // Reset form
            setShowAddressForm(false);
            setEditingAddressIndex(null);
            setNewAddress({
                fullName: user?.name || "",
                phone: user?.phone || "",
                email: user?.email || "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pincode: "",
                landmark: "",
            });
        } catch (err) {
            console.error("Failed to save address:", err);
            setError("Failed to save address. Please try again.");
        } finally {
            setIsSavingAddress(false);
        }
    };

    // Select saved address
    const handleSelectAddress = (index: number) => {
        setSelectedAddressIndex(index);
        setShippingAddress(savedAddresses[index]);
    };

    // Edit address
    const handleEditAddress = (index: number) => {
        setEditingAddressIndex(index);
        setNewAddress(savedAddresses[index]);
        setShowAddressForm(true);
    };

    // Delete address state
    const [isDeletingAddress, setIsDeletingAddress] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    // Open delete confirmation popup
    const handleDeleteClick = (index: number) => {
        setShowDeleteConfirm(index);
    };

    // Close delete confirmation popup
    const handleCancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    // Confirm and delete address
    const handleConfirmDelete = async () => {
        if (showDeleteConfirm === null) return;

        const index = showDeleteConfirm;
        const addressToDelete = savedAddresses[index];

        if (!addressToDelete._id || !user?._id) {
            // If no _id, just remove locally
            const updatedAddresses = savedAddresses.filter((_, i) => i !== index);
            setSavedAddresses(updatedAddresses);
            if (selectedAddressIndex === index) {
                setSelectedAddressIndex(0);
                if (updatedAddresses.length > 0) {
                    setShippingAddress(updatedAddresses[0]);
                }
            } else if (selectedAddressIndex > index) {
                setSelectedAddressIndex(selectedAddressIndex - 1);
            }
            if (user?._id) {
                cacheAddresses(user._id, updatedAddresses);
            }
            setShowDeleteConfirm(null);
            return;
        }

        setIsDeletingAddress(index);

        try {
            console.log("Deleting address:", addressToDelete._id);

            await fetchApi(API_ENDPOINTS.deleteAddress(addressToDelete._id, user._id), {
                method: "DELETE",
            });

            console.log("Address deleted successfully");

            // Update local state
            const updatedAddresses = savedAddresses.filter((_, i) => i !== index);
            setSavedAddresses(updatedAddresses);

            // Update selected index if needed
            if (selectedAddressIndex === index) {
                setSelectedAddressIndex(0);
                if (updatedAddresses.length > 0) {
                    setShippingAddress(updatedAddresses[0]);
                }
            } else if (selectedAddressIndex > index) {
                setSelectedAddressIndex(selectedAddressIndex - 1);
            }

            // Update cache
            cacheAddresses(user._id, updatedAddresses);

        } catch (err) {
            console.error("Failed to delete address:", err);
            setError("Failed to delete address. Please try again.");
        } finally {
            setIsDeletingAddress(null);
            setShowDeleteConfirm(null);
        }
    };

    // Cancel address form
    const handleCancelAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddressIndex(null);
        setNewAddress({
            fullName: user?.name || "",
            phone: user?.phone || "",
            email: user?.email || "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
            landmark: "",
        });
        setError("");
    };

    // Get product image
    const getProductImage = (images: string[]): string => {
        if (!images || images.length === 0) return "/placeholder.svg";
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
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    // Validate form
    const validateForm = (): boolean => {
        const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
        for (const field of required) {
            if (!shippingAddress[field as keyof ShippingAddress]) {
                setError(`Please fill ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
                return false;
            }
        }
        if (shippingAddress.phone.length < 10) {
            setError("Please enter a valid phone number");
            return false;
        }
        if (shippingAddress.pincode.length !== 6) {
            setError("Please enter a valid 6-digit pincode");
            return false;
        }
        return true;
    };

    // Place order: upload screenshot if QR, then create order
    const handlePlaceOrder = async () => {
        setError("");

        if (!validateForm()) return;

        if (paymentMethod === "qr" && !paymentScreenshot) {
            setError("Please upload your payment screenshot before placing the order.");
            return;
        }

        if (!user?._id) {
            setError("Please log in to place order.");
            return;
        }

        setIsPlacingOrder(true);

        try {
            let screenshotUrl: string | null = null;

            // If QR: upload screenshot first via orders/upload-screenshot
            if (paymentMethod === "qr" && paymentScreenshot) {
                const formData = new FormData();
                // Backend often expects "file" as field name for file upload
                formData.append("file", paymentScreenshot);
                const uploadRes = await uploadApiFile<{ success?: boolean; screenshotUrl?: string }>(
                    API_ENDPOINTS.uploadScreenshot,
                    formData
                );
                const raw = uploadRes as any;
                // Upload returns { success, message, screenshotUrl }
                screenshotUrl = raw?.screenshotUrl ?? null;
                if (!raw?.success || !screenshotUrl) {
                    setError("Could not upload payment screenshot. Please try again.");
                    setIsPlacingOrder(false);
                    return;
                }
            }

            // Build order items for API: { product, quantity, price, size } - size from cart's selectedSize
            const orderItems = cartItems.map((item) => ({
                product: item.product?._id,
                quantity: item.quantity,
                price: item.product?.price ?? 0,
                size: item.selectedSize ?? undefined,
            }));

            // Create order via orders/create - payload matches backend expectation
            const createPayload = {
                user: user._id,
                items: orderItems,
                total,
                paymentMethod: paymentMethod === "qr" ? "qr" : "cod",
                paymentScreenshot: paymentMethod === "qr" ? screenshotUrl : null,
                shippingAddress: {
                    fullName: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                    email: shippingAddress.email,
                    addressLine1: shippingAddress.addressLine1,
                    addressLine2: shippingAddress.addressLine2 || undefined,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode,
                    landmark: shippingAddress.landmark || undefined,
                },
            };

            const orderRes = await fetchApi<{ _id?: string; data?: { _id?: string } }>(API_ENDPOINTS.orderCreate, {
                method: "POST",
                body: JSON.stringify(createPayload),
            });

            const orderData = orderRes as any;
            const createdOrderId = orderData?._id ?? orderData?.data?._id ?? "ORD" + Date.now().toString().slice(-8);
            setOrderId(createdOrderId);
            setOrderSuccess(true);
        } catch (err) {
            console.error("Order failed:", err);
            setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // Indian states for dropdown
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Delhi", "Jammu and Kashmir", "Ladakh"
    ];

    // Not authenticated
    if (!authLoading && !isAuthenticated) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
                        <p className="text-gray-600 mb-8">You need to be logged in to checkout.</p>
                        <Link
                            href="/login"
                            className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading || authLoading || cartLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                    <span className="ml-3 text-gray-600">Loading checkout...</span>
                </div>
            </div>
        );
    }

    // Empty cart
    if (cartItems.length === 0 && !orderSuccess) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">Add items to your cart before checkout.</p>
                        <Link
                            href="/hardware"
                            className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Order success
    if (orderSuccess) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['Poppins']">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-gray-600 mb-2">
                            Thank you for your order. Your order ID is:
                        </p>
                        <p className="text-xl font-bold text-gray-900 mb-6">{orderId}</p>
                        <p className="text-gray-600 mb-8">
                            We&apos;ll send you an email confirmation with order details and tracking information.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/orders"
                                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                            >
                                View Orders
                            </Link>
                            <Link
                                href="/hardware"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
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
                        <span className="font-medium">Back to Cart</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Poppins']">
                        Checkout
                    </h1>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
                                        Shipping Address
                                    </h2>
                                </div>
                            </div>

                            {/* Saved Addresses */}
                            {!showAddressForm && (
                                <div className="space-y-4">
                                    {savedAddresses.map((address, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectAddress(index)}
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedAddressIndex === index
                                                    ? "border-gray-700 bg-gray-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selectedAddressIndex === index
                                                            ? "border-gray-700 bg-gray-700"
                                                            : "border-gray-300"
                                                        }`}>
                                                        {selectedAddressIndex === index && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {address.fullName || "Name not set"}
                                                        </p>
                                                        {address.phone && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                <Phone className="w-3 h-3 inline mr-1" />
                                                                {address.phone}
                                                            </p>
                                                        )}
                                                        {address.email && (
                                                            <p className="text-sm text-gray-600">
                                                                <Mail className="w-3 h-3 inline mr-1" />
                                                                {address.email}
                                                            </p>
                                                        )}
                                                        {address.addressLine1 ? (
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                {address.addressLine1}
                                                                {address.addressLine2 && `, ${address.addressLine2}`}
                                                                {address.city && `, ${address.city}`}
                                                                {address.state && `, ${address.state}`}
                                                                {address.pincode && ` - ${address.pincode}`}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm text-orange-600 mt-2">
                                                                Address details not added yet
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditAddress(index);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Edit Address"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(index);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Address"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add New Address Button */}
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="font-medium">Add New Address</span>
                                    </button>
                                </div>
                            )}

                            {/* Add/Edit Address Form */}
                            {showAddressForm && (
                                <div className="border-2 border-gray-200 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900">
                                            {editingAddressIndex !== null ? "Edit Address" : "Add New Address"}
                                        </h3>
                                        <button
                                            onClick={handleCancelAddressForm}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={newAddress.fullName}
                                                    onChange={handleNewAddressChange}
                                                    placeholder="Enter full name"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={newAddress.phone}
                                                    onChange={handleNewAddressChange}
                                                    placeholder="10-digit phone number"
                                                    maxLength={10}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={newAddress.email}
                                                    onChange={handleNewAddressChange}
                                                    placeholder="Enter email address"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        {/* Address Line 1 */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                name="addressLine1"
                                                value={newAddress.addressLine1}
                                                onChange={handleNewAddressChange}
                                                placeholder="House/Flat No., Building Name, Street"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* Address Line 2 */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name="addressLine2"
                                                value={newAddress.addressLine2}
                                                onChange={handleNewAddressChange}
                                                placeholder="Area, Colony (Optional)"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newAddress.city}
                                                onChange={handleNewAddressChange}
                                                placeholder="Enter city"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* State */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State *
                                            </label>
                                            <select
                                                name="state"
                                                value={newAddress.state}
                                                onChange={handleNewAddressChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white text-gray-900"
                                            >
                                                <option value="">Select State</option>
                                                {indianStates.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Pincode */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pincode *
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newAddress.pincode}
                                                onChange={handleNewAddressChange}
                                                placeholder="6-digit pincode"
                                                maxLength={6}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>

                                        {/* Landmark */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Landmark
                                            </label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                value={newAddress.landmark}
                                                onChange={handleNewAddressChange}
                                                placeholder="Near (Optional)"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={handleCancelAddressForm}
                                            disabled={isSavingAddress}
                                            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveAddress}
                                            disabled={isSavingAddress}
                                            className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isSavingAddress ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Save Address
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Method - only COD or QR Scan */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
                                    Payment Method
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* COD */}
                                <label
                                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "cod"
                                            ? "border-gray-700 bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                        className="w-5 h-5 text-gray-700"
                                    />
                                    <Truck className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                        <p className="text-sm text-gray-500">Pay when you receive</p>
                                    </div>
                                </label>

                                {/* QR Scan (UPI) */}
                                <label
                                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "qr"
                                            ? "border-gray-700 bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="qr"
                                        checked={paymentMethod === "qr"}
                                        onChange={(e) => {
                                            setPaymentMethod(e.target.value as PaymentMethod);
                                            if (e.target.value !== "qr") setPaymentScreenshot(null);
                                        }}
                                        className="w-5 h-5 text-gray-700"
                                    />
                                    <Wallet className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900">QR Scan</p>
                                        <p className="text-sm text-gray-500">Scan with UPI app to pay</p>
                                    </div>
                                </label>
                            </div>

                            {/* UPI QR code - show when QR Scan is selected */}
                            {paymentMethod === "qr" && (
                                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Scan to pay with any UPI app</p>
                                    {/* <p className="text-xs text-gray-600 mb-4">GPay, PhonePe, Paytm, or any UPI app — amount will be pre-filled.</p> */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="flex-shrink-0 p-4 bg-white rounded-xl shadow-inner">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                                    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${total.toFixed(2)}&cu=INR`
                                                )}`}
                                                alt="UPI Payment QR Code"
                                                className="w-[200px] h-[200px] rounded-lg"
                                                width={200}
                                                height={200}
                                            />
                                        </div>
                                        <div className="text-center sm:text-left space-y-2">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium text-gray-700">UPI ID:</span> {UPI_ID}
                                            </p>
                                            <p className="text-lg font-bold text-gray-900">
                                                Amount: {formatPrice(total)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Scan the QR from any UPI app; the amount will be filled automatically.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment screenshot upload - file picker */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Upload payment screenshot <span className="text-red-600">*</span>
                                        </p>
                                        <p className="text-xs text-gray-600 mb-3">
                                            After paying via UPI, upload a screenshot of the payment success screen. This is <strong>required</strong> to complete your order.
                                        </p>
                                        <label className="flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer">
                                            <span className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors">
                                                <CreditCard className="w-4 h-4" />
                                                Choose screenshot
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    setPaymentScreenshot(file || null);
                                                }}
                                            />
                                            {paymentScreenshot && (
                                                <span className="text-sm text-gray-600">
                                                    {paymentScreenshot.name}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setPaymentScreenshot(null);
                                                        }}
                                                        className="ml-2 text-red-600 hover:text-red-700 text-xs font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
                                    Order Items ({cartItems.length})
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                        <img
                                            src={getProductImage(item.product?.images || [])}
                                            alt={item.product?.name || "Product"}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {item.product?.name || "Product"}
                                            </h3>
                                            {item.product?.material && (
                                                <p className="text-sm text-gray-500">
                                                    {item.product.material}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600 mt-1">
                                                Qty: {item.quantity} × {formatPrice(item.product?.price || 0)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                {formatPrice((item.product?.price || 0) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
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
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full mt-6 py-4 bg-gray-800 text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        Place Order - {formatPrice(total)}
                                    </>
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Secure & Encrypted Payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Easy Returns & Refunds</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Quality Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Address Confirmation Popup */}
            {showDeleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeInUp">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Delete Address?
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to delete this address?
                        </p>

                        {/* Address Preview */}


                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeletingAddress !== null}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeletingAddress !== null}
                                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isDeletingAddress !== null ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-5 h-5" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
