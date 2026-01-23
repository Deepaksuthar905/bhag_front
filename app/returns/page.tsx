"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, AlertCircle, Clock, Package } from "lucide-react";

export default function ReturnPolicyPage() {
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
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <RotateCcw className="w-6 h-6 text-red-700" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                Return & Refund Policy
                            </h1>
                            <p className="text-gray-600 mt-1 font-['Inter']">
                                Our policy on returns, exchanges, and refunds
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
                            Policy Overview
                        </h2>
                        <p className="text-gray-700 leading-relaxed font-['Inter'] mb-4">
                            At BHAGWATI Hardware, we stand behind the quality of our products. We want you to be 
                            completely satisfied with your purchase. If you're not happy with your order, we're here to help.
                        </p>
                        <p className="text-gray-700 leading-relaxed font-['Inter']">
                            This policy outlines the conditions and process for returns, exchanges, and refunds. 
                            Please read it carefully before initiating a return.
                        </p>
                    </div>

                    {/* Return Eligibility */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                            Return Eligibility
                        </h2>
                        <div className="space-y-6">
                            {/* Eligible Items */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-900 font-['Poppins']">
                                        Items Eligible for Return
                                    </h3>
                                </div>
                                <ul className="space-y-2 text-gray-700 ml-7 font-['Inter']">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Defective or damaged products received</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Wrong product delivered (different from what was ordered)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Products in original, unopened packaging with all tags and labels intact</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Returns must be initiated within <strong>7 days</strong> of delivery</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Non-Eligible Items */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <h3 className="text-lg font-semibold text-gray-900 font-['Poppins']">
                                        Items NOT Eligible for Return
                                    </h3>
                                </div>
                                <ul className="space-y-2 text-gray-700 ml-7 font-['Inter']">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Custom-made or personalized items (cut-to-size plywood, custom furniture, etc.)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Products damaged due to misuse, mishandling, or normal wear and tear</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Items without original packaging, tags, or labels</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Products used, installed, or modified after delivery</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Items returned after 7 days of delivery</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Special order items or items procured specifically for the customer</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>Products sold "as-is" or clearance items (unless defective)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Return Process */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                                    Return Process
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Contact Us</h3>
                                            <p className="text-gray-700 font-['Inter']">
                                                Contact us within 7 days of delivery at <strong>+91 89495 99717</strong> or 
                                                email <strong>bhagwatihardware@gmail.com</strong> with your order number, 
                                                product details, and reason for return. Include photos if the product is damaged or defective.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Return Authorization</h3>
                                            <p className="text-gray-700 font-['Inter']">
                                                Our team will review your request and provide a Return Authorization (RA) number if approved. 
                                                Please do not return items without an RA number.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Packaging</h3>
                                            <p className="text-gray-700 font-['Inter']">
                                                Pack the product securely in its original packaging with all accessories, tags, and labels. 
                                                Include a copy of the invoice or order confirmation.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            4
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Return Pickup/Drop-off</h3>
                                            <p className="text-gray-700 font-['Inter']">
                                                We'll arrange for pickup from your address (free for eligible returns) or you can drop off 
                                                the item at our store. Please provide the RA number to the pickup person or store staff.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            5
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Inspection & Processing</h3>
                                            <p className="text-gray-700 font-['Inter']">
                                                Once we receive the product, we'll inspect it to verify the condition and reason for return. 
                                                Processing typically takes 3-5 business days.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            6
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 font-['Poppins']">Refund/Exchange</h3>
                                            <p className="text-gray-700 font-['Inter']">
                                                Upon approval, we'll process your refund or exchange as per your preference. 
                                                You'll be notified via email or phone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refund Policy */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                                    Refund Policy
                                </h2>
                                <div className="space-y-4 text-gray-700 font-['Inter']">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 font-['Poppins']">Refund Methods</h3>
                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>Refunds will be processed using the same payment method used for the original purchase</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>For cash on delivery (COD) orders, refunds will be processed via bank transfer or UPI</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 font-['Poppins']">Refund Timeline</h3>
                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>Refunds are typically processed within <strong>5-7 business days</strong> after return approval</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>Bank transfers may take additional 2-3 business days to reflect in your account</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>You'll receive a confirmation email once the refund is processed</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 font-['Poppins']">Refund Amount</h3>
                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>Full refund for defective, damaged, or wrong products</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>Original delivery charges are non-refundable unless the return is due to our error</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>Return pickup charges (if applicable) may be deducted from the refund amount</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exchange Policy */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins'] mb-4">
                            Exchange Policy
                        </h2>
                        <div className="space-y-3 text-gray-700 font-['Inter']">
                            <p>
                                We offer exchanges for products of equal or higher value. If you wish to exchange a product:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span>•</span>
                                    <span>Contact us within 7 days of delivery to request an exchange</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>•</span>
                                    <span>Product must be in original, unused condition with all packaging and tags</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>•</span>
                                    <span>If the new product costs more, you'll need to pay the difference</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>•</span>
                                    <span>If the new product costs less, we'll refund the difference</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>•</span>
                                    <span>Exchange is subject to product availability</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 md:p-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold text-yellow-900 font-['Poppins'] mb-4">
                                    Important Notes
                                </h2>
                                <ul className="space-y-2 text-yellow-800 font-['Inter']">
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>Please inspect products immediately upon delivery. Report any issues within 24 hours</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>Keep the original packaging and invoice until you're satisfied with the product</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>For defective products, we may offer repair or replacement instead of refund, at our discretion</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>We reserve the right to refuse returns that don't meet our return policy criteria</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-semibold">•</span>
                                        <span>This policy is subject to change. The policy in effect at the time of purchase applies</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact for Returns */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 md:p-8 text-center">
                        <h2 className="text-2xl font-bold text-red-900 font-['Poppins'] mb-3">
                            Need to Return a Product?
                        </h2>
                        <p className="text-red-800 mb-6 font-['Inter']">
                            Contact us to initiate a return or if you have any questions about our return policy
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+918949599717"
                                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Call: +91 89495 99717
                            </a>
                            <a
                                href="mailto:bhagwatihardware@gmail.com"
                                className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                            >
                                Email Us
                            </a>
                            <button
                                onClick={() => router.push("/contact")}
                                className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                            >
                                Visit Contact Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
