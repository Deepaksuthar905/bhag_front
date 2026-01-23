"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, Clock, MapPin, Package, CheckCircle, AlertCircle } from "lucide-react";

export default function ShippingPolicyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Truck className="w-6 h-6 text-blue-700" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                Shipping Policy
                            </h1>
                            <p className="text-gray-600 mt-1 font-['Inter']">
                                Information about our delivery and shipping services
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Overview */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                            Delivery Overview
                        </h2>
                        <p className="text-gray-700 leading-relaxed font-['Inter'] mb-4">
                            At BHAGWATI Hardware, we are committed to delivering your orders safely and on time. 
                            We offer delivery services for hardware items, plywood, furniture, and other products 
                            to customers in Jodhpur and surrounding areas.
                        </p>
                        <p className="text-gray-700 leading-relaxed font-['Inter']">
                            Our delivery team ensures careful handling of all products, especially fragile items 
                            like plywood sheets and furniture pieces.
                        </p>
                    </div>

                    {/* Delivery Areas */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                                    Delivery Areas
                                </h2>
                                <p className="text-gray-700 leading-relaxed font-['Inter'] mb-4">
                                    We currently provide delivery services in the following areas:
                                </p>
                                <ul className="space-y-2 text-gray-700 font-['Inter']">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Jodhpur City (All areas)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Jodhpur Suburbs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Nearby towns (on case-by-case basis)</span>
                                    </li>
                                </ul>
                                <p className="text-gray-600 text-sm mt-4 font-['Inter']">
                                    For delivery outside Jodhpur, please contact us at +91 89495 99717 to check 
                                    availability and additional charges.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Timeframes */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                                    Delivery Timeframes
                                </h2>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 font-['Poppins']">
                                            In-Stock Items
                                        </h3>
                                        <p className="text-gray-700 font-['Inter']">
                                            For products available in stock, delivery typically takes <strong>1-3 business days</strong> 
                                            within Jodhpur city limits. Orders placed before 2:00 PM may be eligible for same-day 
                                            or next-day delivery (subject to availability and location).
                                        </p>
                                    </div>
                                    <div className="border-l-4 border-orange-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 font-['Poppins']">
                                            Out-of-Stock Items
                                        </h3>
                                        <p className="text-gray-700 font-['Inter']">
                                            For items that need to be procured, delivery may take <strong>5-7 business days</strong>. 
                                            We'll keep you informed about the expected delivery date.
                                        </p>
                                    </div>
                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 font-['Poppins']">
                                            Custom Orders & Bulk Orders
                                        </h3>
                                        <p className="text-gray-700 font-['Inter']">
                                            Custom-made furniture, cut-to-size plywood, and bulk orders may take <strong>7-15 business days</strong> 
                                            depending on the complexity and quantity. We'll provide a specific timeline at the time of order confirmation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Charges */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <Package className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                                    Delivery Charges
                                </h2>
                                <div className="space-y-3 text-gray-700 font-['Inter']">
                                    <p className="mb-4">
                                        Delivery charges are calculated based on order value, product weight/size, and delivery location:
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span><strong>Free Delivery:</strong> Available for orders above ₹5,000 within Jodhpur city limits</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span><strong>Standard Delivery:</strong> ₹50 - ₹200 for orders below ₹5,000 (varies by location)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span><strong>Heavy/Bulky Items:</strong> Additional charges may apply for large furniture, plywood sheets, or heavy hardware items</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span><strong>Out-of-City Delivery:</strong> Charges vary based on distance and will be communicated at the time of order</span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-600 text-sm mt-4">
                                        Exact delivery charges will be displayed at checkout or communicated during order confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Process */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                            Delivery Process
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Order Confirmation</h3>
                                    <p className="text-gray-700 font-['Inter']">
                                        Once you place an order, you'll receive an order confirmation via email or SMS with order details and estimated delivery date.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Processing</h3>
                                    <p className="text-gray-700 font-['Inter']">
                                        We'll process your order, verify product availability, and prepare it for dispatch.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Dispatch Notification</h3>
                                    <p className="text-gray-700 font-['Inter']">
                                        You'll receive a notification when your order is dispatched with tracking information (if available).
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Delivery</h3>
                                    <p className="text-gray-700 font-['Inter']">
                                        Our delivery team will contact you before delivery to confirm the address and preferred time. 
                                        Please ensure someone is available to receive the order.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 md:p-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-yellow-900 font-['Poppins'] mb-4">
                                    Important Delivery Notes
                                </h2>
                                <ul className="space-y-2 text-yellow-800 font-['Inter']">
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>Please provide accurate and complete delivery address with landmarks to avoid delays</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>Someone must be available at the delivery address during the scheduled delivery time</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>Please inspect the products at the time of delivery. Report any damage or defects immediately</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>For large items like furniture or plywood sheets, please ensure adequate space and access at the delivery location</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>Delivery may be delayed due to weather conditions, festivals, or unforeseen circumstances. We'll keep you informed</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>If delivery is attempted and no one is available, we'll contact you to reschedule</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact for Delivery Queries */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 text-center">
                        <h2 className="text-2xl font-bold text-blue-900 font-['Poppins'] mb-3">
                            Have Questions About Delivery?
                        </h2>
                        <p className="text-blue-800 mb-6 font-['Inter']">
                            Contact our delivery team for any queries or special delivery requirements
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+918949599717"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Call: +91 89495 99717
                            </a>
                            <a
                                href="mailto:bhagwatihardware@gmail.com"
                                className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
