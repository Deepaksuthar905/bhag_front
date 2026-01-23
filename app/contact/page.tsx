"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Clock,
    Building2,
    Package,
    CheckCircle,
} from "lucide-react";

export default function ContactPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Poppins']">
                        Contact Us
                    </h1>
                    <p className="text-gray-600 mt-2 font-['Inter']">
                        Get in touch with us for any queries about hardware, plywood, furniture, and more
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Shop Info - Full Width */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-8 h-8 text-gray-700" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-2">
                                BHAGWATI ENTERPRISES
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                                Your trusted destination for premium hardware, plywood, furniture, and handicrafts. 
                                Quality products for home and commercial spaces.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Contact Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Details */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-900 font-['Poppins'] mb-6">
                                Get in Touch
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                                        <a
                                            href="tel:+918949599717"
                                            className="text-gray-900 font-semibold hover:text-blue-600 transition-colors block"
                                        >
                                            +91 89495 99717
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                                        <a
                                            href="mailto:bhagwatihardware@gmail.com"
                                            className="text-gray-900 font-semibold hover:text-green-600 transition-colors break-all block"
                                        >
                                            bhagwatihardware@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors md:col-span-2">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-2">Address</p>
                                        <p className="text-gray-900 font-medium leading-relaxed">
                                            Shop no. 5, Bhagwati Hardware,<br />
                                            Opposite Ankur Hospital,<br />
                                            Paota C Road, Jodhpur - 342006
                                        </p>
                                        <a
                                            href="https://maps.google.com/?q=Shop+no.+5,+Bhagwati+Hardware,+Opposite+Ankur+Hospital,+Paota+C+Road,+Jodhpur"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            View on Google Maps
                                        </a>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors md:col-span-2">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-2">Business Hours</p>
                                        <div className="text-gray-900 font-medium space-y-1">
                                            <p>Monday - Saturday: <span className="text-gray-700">9:00 AM - 8:00 PM</span></p>
                                            <p>Sunday: <span className="text-gray-700">10:00 AM - 6:00 PM</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products We Deal In */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-900 font-['Poppins'] mb-6">
                                Products We Deal In
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Hardware Items</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Plywood & Wood Products</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Furniture</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Fevicol & Adhesives</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors sm:col-span-2">
                                    <Package className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Handicrafts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Why Choose Us */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 md:p-8 sticky top-24">
                            <h3 className="text-xl font-bold text-blue-900 mb-6 font-['Poppins']">
                                Why Choose BHAGWATI Hardware?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-blue-900 font-medium text-sm leading-relaxed">
                                        Wide range of premium hardware and plywood products
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-blue-900 font-medium text-sm leading-relaxed">
                                        Quality guaranteed products for home and commercial use
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-blue-900 font-medium text-sm leading-relaxed">
                                        Competitive prices and bulk order discounts
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-blue-900 font-medium text-sm leading-relaxed">
                                        Expert advice and personalized service
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-blue-900 font-medium text-sm leading-relaxed">
                                        Fast delivery and reliable after-sales support
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
