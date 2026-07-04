"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Star, ArrowRight, Eye, Heart, ShoppingCart } from "lucide-react"

interface Product {
    id: string
    name: string
    dosage: string
    price: number
    originalPrice?: number
    discount?: number
    image: string
    rating: number
    reviews: number
}

const bestSellers: Product[] = [
    { id: "b1", name: "BPC-157 (Body Protective)", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, discount: 23, image: "/assets/products/asset 6.png", rating: 4.9, reviews: 128 },
    { id: "b2", name: "TB-500 (Thymosin Beta)", dosage: "5mg Vial", price: 54.95, image: "/assets/products/asset 7.png", rating: 4.8, reviews: 96 },
    { id: "b3", name: "GHK-Cu (Copper Peptide)", dosage: "50mg Vial", price: 69.95, originalPrice: 89.95, discount: 22, image: "/assets/products/asset 8.png", rating: 4.9, reviews: 67 },
    { id: "b4", name: "Ipamorelin Acetate", dosage: "5mg Vial", price: 39.95, image: "/assets/products/asset 9.png", rating: 4.8, reviews: 112 },
]

function ProductCard({ product }: { product: Product }) {
    const [wishlisted, setWishlisted] = useState(false)
    const [adding, setAdding] = useState(false)

    const handleAdd = () => {
        setAdding(true)
        setTimeout(() => setAdding(false), 400)
    }

    return (
        <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200">
            <div className="relative p-3 pb-1">
                {product.discount && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded z-10">
                        {product.discount}% off
                    </span>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
                    <button onClick={() => setWishlisted(!wishlisted)} className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors">
                        <Heart className={`w-3.5 h-3.5 ${wishlisted ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                    </button>
                    <button className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                </div>
                <div className="flex items-center justify-center h-24 sm:h-32 lg:h-36 my-1">
                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
            </div>
            <div className="px-3 pb-3">
                <h3 className="text-[11px] sm:text-xs font-medium text-gray-800 leading-snug mb-1 line-clamp-2 min-h-[2.2em]">{product.name}</h3>
                <p className="text-[10px] text-gray-400 mb-1.5">{product.dosage}</p>
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                        ))}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-2.5">
                    <span className="text-sm sm:text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && <span className="text-[10px] sm:text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                </div>
                <button
                    onClick={handleAdd}
                    disabled={adding}
                    className={`w-full flex items-center justify-center gap-1.5 text-white text-[11px] sm:text-xs font-medium py-2 sm:py-2.5 rounded-lg transition-all duration-300 ${adding ? "bg-emerald-400 scale-95" : "bg-emerald-500 hover:bg-emerald-600"}`}
                >
                    {adding ? (
                        <>
                            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default function BestSellers() {
    return (
        <section className="py-8 sm:py-12 bg-white border-t border-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Best Sellers</h2>
                    <Link href="/store" className="text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {bestSellers.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
