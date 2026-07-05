"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Star, ArrowRight, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  handle: string
  dosage: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
}

const staticProducts: Product[] = [
  // Peptides
  {
    id: "1",
    name: "BPC-157",
    handle: "bpc-157-5mg-vial",
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
    handle: "tb-500-5mg-vial",
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
    handle: "ghk-cu-50mg-vial",
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
    handle: "cjc-1295-2mg-vial",
    dosage: "2mg Vial",
    price: 44.95,
    originalPrice: 59.95,
    category: "Peptides",
    image: "/assets/products/asset 8.png",
    rating: 4.7,
    reviews: 85,
  },
  // Nootropics
  {
    id: "5",
    name: "Semax (1%)",
    handle: "semax-1-percent",
    dosage: "Nasal Spray · 3ml",
    price: 59.95,
    originalPrice: 74.95,
    category: "Nootropics",
    image: "/assets/products/asset 9.png",
    rating: 4.8,
    reviews: 54,
  },
  {
    id: "6",
    name: "Selank (0.15%)",
    handle: "selank-nasal-spray",
    dosage: "Nasal Spray · 5ml",
    price: 64.95,
    originalPrice: 79.95,
    category: "Nootropics",
    image: "/assets/products/asset 6.png",
    rating: 4.7,
    reviews: 41,
  },
  // Supplements
  {
    id: "7",
    name: "Tongkat Ali",
    handle: "tongkat-ali-200mg",
    dosage: "200:1 Extract · 60 Capsules",
    price: 29.99,
    originalPrice: 39.99,
    category: "Supplements",
    image: "/assets/products/asset 7.png",
    rating: 4.8,
    reviews: 92,
  },
  {
    id: "8",
    name: "Ashwagandha KSM-66",
    handle: "ashwagandha-ksm66",
    dosage: "600mg · 90 Capsules",
    price: 24.99,
    originalPrice: 34.99,
    category: "Supplements",
    image: "/assets/products/asset 8.png",
    rating: 4.9,
    reviews: 116,
  },
  // Gummies
  {
    id: "9",
    name: "Protein + Creatine Gummies",
    handle: "protein-creatine-gummies",
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
    handle: "coq10",
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
    handle: "beef-liver-pills",
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
    handle: "l-reuteri",
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
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts)

  // Fetch live products from database
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const res = await fetch("http://localhost:9000/store/products", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          const dbProducts: Product[] = (data.products || []).map((p: any) => ({
            id: p.id,
            name: p.title || p.name,
            handle: p.handle || p.slug,
            dosage: p.dosage || p.short_description || "",
            price: p.variants?.[0]?.calculated_price?.calculated_amount || 0,
            originalPrice: p.variants?.[0]?.calculated_price?.original_amount || undefined,
            category: p.category?.name || "Peptides",
            image: p.thumbnail || "/assets/products/asset 6.png",
            rating: 4.8,
            reviews: Math.floor(Math.random() * 100) + 20,
          }))
          if (dbProducts.length > 0) {
            // Merge: database products first, then static fallback
            setAllProducts([...dbProducts, ...staticProducts])
          }
        }
      } catch {
        // Keep static fallback on network error
      }
    }
    fetchLiveProducts()
  }, [])

  const filteredProducts =
    activeTab === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeTab)

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent("add-to-cart", {
      detail: { productId: product.id, quantity: 1 }
    }))
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Star className="w-3 h-3 fill-emerald-500" />
          Popular Research Compounds
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Featured Products
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Explore our curated selection of premium peptides, nootropics, and supplements
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              activeTab === tab
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-150"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200/80 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image area */}
              <div className="relative p-3 pb-2 bg-gradient-to-b from-gray-50 to-white/40 border-b border-gray-100 flex items-center justify-center h-28 sm:h-36 lg:h-40 overflow-hidden flex-shrink-0">
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md z-10 shadow-sm">
                    Save ${(product.originalPrice - product.price).toFixed(0)}
                  </span>
                )}
                <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md z-10">
                  {product.category}
                </span>

                <div className="flex items-center justify-center h-full w-full p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-gray-800 leading-tight mb-1 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-bold mb-2">
                    {product.dosage}
                  </p>

                  <div className="flex items-center gap-1 mb-2.5">
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
                    <span className="text-xs sm:text-sm text-gray-400 font-bold">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-base sm:text-lg font-black text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full flex items-center justify-center gap-1.5 bg-gray-900 group-hover:bg-emerald-600 active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold py-2.5 rounded-xl transition-all duration-300"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
