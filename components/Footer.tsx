"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const shopLinks = [
        { name: "Hardware", href: "/hardware" },
        { name: "Plywood", href: "/plywood" },
        { name: "Fevicol", href: "/fevicol" },
        { name: "Furniture", href: "/furniture" },
        { name: "Handicraft", href: "/handicraft" },
    ];

    const accountLinks = [
        { name: "My Profile", href: "/profile" },
        { name: "My Orders", href: "/orders" },
        { name: "Wishlist", href: "/wishlist" },
        { name: "Cart", href: "/cart" },
    ];

    const supportLinks = [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Shipping Policy", href: "/shipping" },
        { name: "Return Policy", href: "/returns" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <h3 className="text-2xl font-bold text-white">BHAGWATI</h3>
                        </Link>
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                            Your trusted destination for premium hardware, plywood, furniture, and handicrafts. Quality products for home and commercial spaces.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="mt-6 space-y-3">
                            <a 
                                href="tel:+918949599717" 
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                            >
                                <Phone size={16} />
                                <span>+91 89495 99717</span>
                            </a>
                            <a 
                                href="mailto:bhagwatihardware@gmail.com" 
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                            >
                                <Mail size={16} />
                                <span>bhagwatihardware@gmail.com</span>
                            </a>
                            <div className="flex items-start gap-2 text-gray-400 text-sm">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                <span>Shop no. 5, Bhagwati Hardware, opposite Ankur Hospital Paota c road Jodhpur, 342006</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links - Hidden on mobile */}
                    <div className="hidden md:block">
                        <h4 className="font-semibold text-white mb-4">Shop</h4>
                        <ul className="space-y-3">
                            {shopLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links - Hidden on mobile */}
                    <div className="hidden md:block">
                        <h4 className="font-semibold text-white mb-4">My Account</h4>
                        <ul className="space-y-3">
                            {accountLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-10 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Follow us:</span>
                            <div className="flex gap-4">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </a>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={18} />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors"
                                    aria-label="Twitter"
                                >
                                    <Twitter size={18} />
                                </a>
                            </div>
                        </div>
                        
                        {/* Payment Methods - Optional */}
                        {/* <div className="flex items-center gap-3 text-gray-500 text-sm">
                            <span>We accept:</span>
                            <span className="px-2 py-1 bg-gray-800 rounded text-xs">UPI</span>
                            <span className="px-2 py-1 bg-gray-800 rounded text-xs">Cards</span>
                            <span className="px-2 py-1 bg-gray-800 rounded text-xs">Net Banking</span>
                            <span className="px-2 py-1 bg-gray-800 rounded text-xs">COD</span>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="bg-gray-950 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        © {currentYear} BHAGWATI Hardware. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
