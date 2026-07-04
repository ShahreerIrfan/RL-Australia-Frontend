"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Star, ArrowRight, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  dosage: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
}

const allProducts: Product[] = [
  // Peptides
  {
    id: "1",
    name: "BPC-157",
    dosage: "5mg Vial",
    price: 49.95,
    originalPrice: 64.95,
    category: "Peptides",
    image: "/assets/products/asset 6.png",
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "2",
    name: "TB-500 (Thymosin Beta)",
    dosage: "5mg Vial",
    price: 54.95,
    originalPrice: 69.95,
    category: "Peptides",
    image: "/assets/products/asset 7.png",
    rating: 4.8,
    reviews: 96,
  },
  {
    id: "3",
    name: "GHK-Cu (Copper Peptide)",
    dosage: "50mg Vial",
    price: 69.95,
    originalPrice: 89.95,
    category: "Peptides",
    image: "/assets/products/asset 10.png",
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "4",
    name: "CJC-1295 (No DAC)",
    dosage: "2mg Vial",
    price: 44.95,
    originalPrice: 59.95,
    category: "Peptides",
    image: "/assets/products/asset 8.png",
    rating: 4.7,
    reviews: 84,
  },
  // Nootropics
  {
    id: "5",
    name: "Alpha-GPC",
    dosage: "60 Capsules · 300mg",
    price: 34.95,
    category: "Nootropics",
    image: "/assets/products/asset 9.png",
    rating: 4.7,
    reviews: 84,
  },
  {
    id: "6",
    name: "L-Theanine",
    dosage: "60 Capsules · 200mg",
    price: 24.95,
    category: "Nootropics",
    image: "/assets/products/asset 12.png",
    rating: 4.7,
    reviews: 58,
  },
  // Supplements
  {
    id: "7",
    name: "NMN (Longevity)",
    dosage: "30 Capsules · 250mg",
    price: 22.99,
    originalPrice: 28.99,
    category: "Supplements",
    image: "/assets/products/asset 11.png",
    rating: 4.8,
    reviews: 112,
  },
  {
    id: "8",
    name: "Glycine",
    dosage: "120 Capsules · 1000mg",
    price: 17.99,
    originalPrice: 21.99,
    category: "Supplements",
    image: "/assets/products/asset 13.png",
    rating: 4.5,
    reviews: 91,
  },
  // Gummies & Functional Foods
  {
    id: "9",
    name: "Protein + Creatine Gummies",
    dosage: "30 Gummies",
    price: 16.99,
    originalPrice: 19.99,
    category: "Gummies",
    image: "/assets/products/asset 6.png",
    rating: 4.6,
    reviews: 73,
  },
  {
    id: "10",
    name: "CoQ10",
    dosage: "60 Softgels · 100mg",
    price: 18.99,
    originalPrice: 23.99,
    category: "Supplements",
    image: "/assets/products/asset 7.png",
    rating: 4.7,
    reviews: 55,
  },
  // Add-ons
  {
    id: "11",
    name: "Beef Liver Pills",
    dosage: "120 Capsules",
    price: 19.99,
    originalPrice: 24.99,
    category: "Add-ons",
    image: "/assets/products/asset 8.png",
    rating: 4.5,
    reviews: 42,
  },
  {
    id: "12",
    name: "L. Reuteri (Probiotic)",
    dosage: "30 Capsules",
    price: 20.99,
    originalPrice: 25.99,
    category: "Supplements",
    image: "/assets/products/asset 9.png",
    rating: 4.6,
    reviews: 38,
  },
]

const filterTabs = ["All", "Peptides", "Nootropics", "Supplements", "Gummies", "Add-ons"]

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("All")

  const filteredProducts =
    activeTab === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeTab)

  return (
    <section className="py-12 sm:py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Popular Products
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Top picks across all categories
            </p>
          </div>
          <Link
            href="/store"
            className="text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200"
            >
              {/* Image area */}
              <div className="relative p-3 pb-1">
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded z-10">
                    Save ${(product.originalPrice - product.price).toFixed(0)}
                  </span>
                )}
                <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded z-10">
                  {product.category}
                </span>

                <div className="flex items-center justify-center h-24 sm:h-32 lg:h-36 my-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="px-3 pb-3">
                <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-snug mb-0.5 line-clamp-1">
                  {product.name}
                </h3>
                {/* Dosage/mg display — clear and simple per Peptide Paradise reference */}
                <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mb-1.5">
                  {product.dosage}
                </p>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                          i < Math.floor(product.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-2.5">
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="w-full flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-[11px] sm:text-xs font-medium py-2 sm:py-2.5 rounded-lg transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  View Product
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
