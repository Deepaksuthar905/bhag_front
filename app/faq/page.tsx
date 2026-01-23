"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

export default function FAQPage() {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            question: "What products do you offer?",
            answer: "We offer a wide range of hardware items, plywood, furniture, Fevicol & adhesives, and handicrafts. Our product catalog includes everything from basic hardware tools to premium quality plywood sheets and ready-made furniture pieces."
        },
        {
            question: "Do you provide bulk order discounts?",
            answer: "Yes, we offer attractive discounts on bulk orders. The discount percentage depends on the quantity and product category. Please contact us at +91 89495 99717 or email us at bhagwatihardware@gmail.com with your requirements, and we'll provide you with a customized quote."
        },
        {
            question: "What are your business hours?",
            answer: "We are open Monday to Saturday from 9:00 AM to 8:00 PM, and on Sundays from 10:00 AM to 6:00 PM. You can visit our store at Shop no. 5, Bhagwati Hardware, Opposite Ankur Hospital, Paota C Road, Jodhpur - 342006."
        },
        {
            question: "How can I place an order?",
            answer: "You can place an order through our website by adding products to your cart and proceeding to checkout. Alternatively, you can call us at +91 89495 99717 or visit our physical store. For bulk orders, we recommend contacting us directly for better pricing and customization options."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept multiple payment methods including cash on delivery (COD), UPI, credit/debit cards, net banking, and bank transfers. Payment options may vary based on order value and delivery location."
        },
        {
            question: "Do you offer home delivery?",
            answer: "Yes, we provide home delivery services. Delivery charges and timelines depend on your location and order value. Free delivery may be available for orders above a certain amount. Please contact us for specific delivery information in your area."
        },
        {
            question: "How long does delivery take?",
            answer: "Delivery timeframes vary based on product availability and your location. For in-stock items within Jodhpur, delivery typically takes 1-3 business days. For out-of-stock items or custom orders, it may take longer. We'll provide you with an estimated delivery date at the time of order confirmation."
        },
        {
            question: "Can I cancel or modify my order?",
            answer: "You can cancel or modify your order before it's dispatched. Once the order is shipped, cancellation may not be possible. Please contact us immediately at +91 89495 99717 or email bhagwatihardware@gmail.com if you need to cancel or modify your order."
        },
        {
            question: "What is your return and refund policy?",
            answer: "We accept returns for defective or damaged products within 7 days of delivery. Products must be in original condition with packaging. Custom-made items and cut-to-size products are generally non-returnable. Please refer to our Return Policy page for detailed information."
        },
        {
            question: "Do you provide product warranties?",
            answer: "Warranty terms vary by product category and manufacturer. Most hardware items come with manufacturer warranties. We'll provide warranty information at the time of purchase. Please keep your purchase receipt for warranty claims."
        },
        {
            question: "Can I get expert advice on product selection?",
            answer: "Absolutely! Our experienced team is always ready to help you choose the right products for your needs. You can visit our store, call us, or email us with your requirements, and we'll provide expert guidance on product selection, installation, and usage."
        },
        {
            question: "Do you offer installation services?",
            answer: "Installation services may be available for certain products like furniture and hardware fixtures. Please inquire at the time of purchase. Additional charges may apply for installation services."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order is confirmed and dispatched, you'll receive tracking information via email or SMS. You can also contact us directly at +91 89495 99717 to check your order status."
        },
        {
            question: "What if I receive a damaged product?",
            answer: "If you receive a damaged or defective product, please contact us immediately within 24 hours of delivery. We'll arrange for a replacement or refund. Please keep the product and packaging intact for inspection."
        },
        {
            question: "Do you have a physical store I can visit?",
            answer: "Yes, you can visit our store at Shop no. 5, Bhagwati Hardware, Opposite Ankur Hospital, Paota C Road, Jodhpur - 342006. Our store is open Monday to Saturday (9 AM - 8 PM) and Sunday (10 AM - 6 PM)."
        },
        {
            question: "Can I order products that are currently out of stock?",
            answer: "Yes, you can place a pre-order for out-of-stock items. We'll notify you once the product is available and arrange for delivery. You may be required to pay a partial advance for pre-orders."
        },
        {
            question: "Do you provide product samples?",
            answer: "Product samples may be available for certain items like plywood sheets and hardware finishes. Please contact us to check sample availability. Samples may be chargeable or provided free based on the product category."
        },
        {
            question: "What should I do if I have a complaint?",
            answer: "We value your feedback and strive to resolve any issues promptly. Please contact us at +91 89495 99717 or email bhagwatihardware@gmail.com with your complaint details. We'll investigate and respond within 24-48 hours."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <HelpCircle className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                Frequently Asked Questions
                            </h1>
                            <p className="text-gray-600 mt-1 font-['Inter']">
                                Find answers to common questions about our products and services
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-gray-900 font-['Poppins'] pr-4">
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-5 border-t border-gray-100">
                                    <p className="text-gray-700 leading-relaxed mt-4 font-['Inter']">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Still Have Questions Section */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-blue-900 font-['Poppins'] mb-3">
                        Still Have Questions?
                    </h2>
                    <p className="text-blue-800 mb-6 font-['Inter']">
                        Can't find the answer you're looking for? Please get in touch with our friendly team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+918949599717"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Call Us: +91 89495 99717
                        </a>
                        <a
                            href="mailto:bhagwatihardware@gmail.com"
                            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Email Us
                        </a>
                        <button
                            onClick={() => router.push("/contact")}
                            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Visit Contact Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
