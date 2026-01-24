"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Heart, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  isNew?: boolean;
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const heroSlides = [
    {
      title: "Plywood Collection",
      subtitle: "New Arrivals",
      description: "Built for strength, designed for perfection.",
      image: "/gemini-img2.png",
      cta: "Shop Now",
    },
    {
      title: "Trusted Door Hardware",
      subtitle: "Locks That Last",
      description: "Durable locking solutions for homes and commercial spaces.",
      image: "/locks1.jpg",
      cta: "Explore",
    },
    {
      title: "Right Tool. Right Job.",
      subtitle: "Everyday Tools",
      description: "Precision tools for home, workshop, and industry.",
      image: "/tools.png",
      cta: "Discover",
    },
  ];

  const categories = [
    {
      name: "Hardware",
      image: "/platinum-series-banner-image-scaled.webp",
      count: "999+ Items",
      href: "/hardware",
    },
    {
      name: "Plywood",
      image: "/commercial-plywood.jpeg",
      count: "50+ Variety",
      href: "/plywood",
    },
    { 
      name: "Furniture", 
      image: "/furniture.jpg", 
      count: "1000+ designs",
      href: "/furniture",
    },
    { 
      name: "Handicrafts", 
      image: "/handicraft.jpg", 
      count: "1000+ Items",
      href: "/handicraft",
    },
  ];

  const collections = [
  {
    title: "Premium Hardware",
    subtitle: "Strong & Reliable",
    image:
      "home-bg-23.jpg",
  },
  {
    title: "Quality Plywood",
    subtitle: "Durable & Elegant",
    image:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80",
  },
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <div className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div
                key={currentSlide}
                className="text-center text-white px-4 max-w-4xl"
              >
                <p className="text-sm md:text-base tracking-widest mb-4 animate-[fadeInUp_0.8s_ease-out]">
                  {slide.subtitle}
                </p>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
                  {slide.description}
                </p>
                <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
                  {slide.cta}
                  <ChevronRight className="inline ml-2" size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-500">
            Shop by Category
          </h2>

          <p className="text-gray-600">Explore our curated collections</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg cursor-pointer block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-1">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-500">
              Featured Products
            </h2>
            <p className="text-gray-600">Handpicked items just for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden aspect-square">
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-semibold rounded-full z-10">
                      NEW
                    </span>
                  )}
                  <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Heart size={18} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < product.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Banner */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <div
              key={collection.title}
              className="group relative overflow-hidden rounded-lg h-96 cursor-pointer"
            >
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                <p className="text-white/80 text-sm mb-2">
                  {collection.subtitle}
                </p>
                <h3 className="text-white text-3xl font-bold mb-4">
                  {collection.title}
                </h3>
                <button className="self-start bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform group-hover:scale-105">
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
