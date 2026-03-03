"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { fetchAuth, AUTH_ENDPOINTS } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

// JWT payload interface
interface JwtPayload {
    userId?: string;
    id?: string;
    _id?: string;
    user_id?: string;
    sub?: string;
    email?: string;
    name?: string;
    exp?: number;
    iat?: number;
}

interface RegisterResponse {
    message: string;
    token?: string;
    data?: {
        token?: string;
        user?: {
            _id: string;
            email: string;
            name?: string;
        };
    };
    user?: {
        _id: string;
        email: string;
        name?: string;
    };
}

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetchAuth<RegisterResponse>(AUTH_ENDPOINTS.register, {
                method: "POST",
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }),
            });

            console.log("Register response:", response);

            // Handle different response structures
            const token = response.token || response.data?.token;
            const userFromResponse = response.user || response.data?.user;
            const respAny = response as any;

            if (token) {
                // Decode JWT to extract userId
                let userId = "";
                try {
                    const decoded = jwtDecode<JwtPayload>(token);
                    console.log("Decoded JWT:", decoded);
                    // Try different possible field names for user ID in JWT
                    userId = decoded.userId || decoded.id || decoded._id || decoded.user_id || decoded.sub || "";
                } catch (decodeError) {
                    console.error("Failed to decode JWT:", decodeError);
                }

                // If userId not in JWT, try from response
                if (!userId) {
                    userId = userFromResponse?._id || respAny.userId || respAny.id || respAny.data?._id || "";
                }
                
                // Build user data object
                const userData = {
                    _id: userId,
                    email: userFromResponse?.email || formData.email,
                    name: userFromResponse?.name || formData.name,
                    phone: respAny.phone || formData.phone,
                };
                
                console.log("Storing user data:", userData);
                login(token, userData);
                
                setSuccess("Account created successfully! Logging you in...");
                
                // Redirect to home page after successful registration & auto-login
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1000);
            } else {
                // No token returned, redirect to login page
                setSuccess("Account created successfully! Please login.");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            }

        } catch (err) {
            console.error("Register error:", err);
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="max-w-md mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 opacity-30 rounded-3xl blur-3xl"></div>
                    <div className="relative animate-fadeInDown">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-700 font-['Poppins']">
                            Create Account
                        </h1>
                        <p className="text-gray-600 font-medium font-['Inter']">
                            Sign up to get started
                        </p>
                    </div>
                </div>

                {/* Register Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 animate-fadeInUp">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{success}</p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                                Phone Number <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    minLength={10}
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    placeholder="Enter 10-digit phone number"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a password"
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 font-['Inter']">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                required
                                className="mt-1 w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                            />
                            <label className="ml-2 text-sm text-gray-700 font-['Inter']">
                                I agree to the{" "}
                                <Link href="/terms" className="text-gray-700 hover:text-gray-900 font-medium">
                                    Terms & Conditions
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-gray-700 hover:text-gray-900 font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed font-['Inter']"
                        >
                            {isLoading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 mb-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500 font-['Inter']">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Social Register Buttons */}
                    {/* <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['Inter']"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-gray-700 font-medium">Continue with Google</span>
                        </button>
                    </div> */}

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 font-['Inter']">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-gray-700 hover:text-gray-900 transition-colors font-['Inter']"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInDown {
                    animation: fadeInDown 0.6s ease-out;
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}
