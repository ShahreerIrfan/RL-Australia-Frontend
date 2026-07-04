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

function ProductCard({ product, onAddToCart, onQuickView }: { product: Product; onAddToCart: () => void; onQuickView: () => void }) {
    const [wishlisted, setWishlisted] = useState(false)
    const [adding, setAdding] = useState(false)

    const handleAdd = () => {
        setAdding(true)
        setTimeout(() => {
            setAdding(false)
            onAddToCart()
        }, 400)
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
                    <button
                        onClick={() => setWishlisted(!wishlisted)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors"
                    >
                        <Heart className={`w-3.5 h-3.5 ${wishlisted ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                    </button>
                    <button
                        onClick={onQuickView}
                        className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors"
                    >
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
                    {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                </div>
                <button
                    onClick={handleAdd}
                    disabled={adding}
                    className={`w-full flex items-center justify-center gap-1.5 text-white text-[11px] sm:text-xs font-medium py-2 sm:py-2.5 rounded-lg transition-all duration-300 ${adding ? "bg-emerald-400 scale-95" : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
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

const recoveryProducts: Product[] = [
    { id: "r1", name: "BPC-157 Fragment", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, discount: 23, image: "/assets/products/asset 6.png", rating: 4.9, reviews: 128 },
    { id: "r2", name: "TB-500 (Thymosin B4)", dosage: "2mg Vial", price: 44.95, image: "/assets/products/asset 7.png", rating: 4.8, reviews: 96 },
    { id: "r3", name: "KPV Tripeptide", dosage: "10mg Vial", price: 52.95, image: "/assets/products/asset 8.png", rating: 4.7, reviews: 45 },
    { id: "r4", name: "Pentadecapeptide BPC", dosage: "10mg Vial", price: 79.95, originalPrice: 99.95, discount: 20, image: "/assets/products/asset 9.png", rating: 4.8, reviews: 62 },
    { id: "r5", name: "GHK Basic", dosage: "100mg Vial", price: 34.95, image: "/assets/products/asset 10.png", rating: 4.6, reviews: 38 },
]

const growthProducts: Product[] = [
    { id: "g1", name: "CJC-1295 with DAC", dosage: "2mg Vial", price: 54.95, image: "/assets/products/asset 11.png", rating: 4.7, reviews: 84 },
    { id: "g2", name: "GHRP-6 Hexapeptide", dosage: "5mg Vial", price: 36.95, originalPrice: 44.95, discount: 18, image: "/assets/products/asset 12.png", rating: 4.6, reviews: 67 },
    { id: "g3", name: "Hexarelin Acetate", dosage: "5mg Vial", price: 42.95, image: "/assets/products/asset 13.png", rating: 4.5, reviews: 53 },
    { id: "g4", name: "GHRP-2 Peptide", dosage: "5mg Vial", price: 38.95, originalPrice: 48.95, discount: 20, image: "/assets/products/asset 6.png", rating: 4.7, reviews: 71 },
    { id: "g5", name: "MGF (Mechano Growth)", dosage: "2mg Vial", price: 59.95, image: "/assets/products/asset 7.png", rating: 4.8, reviews: 44 },
]

const antiAgingProducts: Product[] = [
    { id: "a1", name: "GHK-Cu Tripeptide", dosage: "50mg Vial", price: 69.95, originalPrice: 89.95, discount: 22, image: "/assets/products/asset 8.png", rating: 4.9, reviews: 67 },
    { id: "a2", name: "Epithalon (Epitalon)", dosage: "10mg Vial", price: 64.95, image: "/assets/products/asset 9.png", rating: 4.8, reviews: 89 },
    { id: "a3", name: "Thymalin Peptide", dosage: "10mg Vial", price: 56.95, image: "/assets/products/asset 10.png", rating: 4.6, reviews: 34 },
    { id: "a4", name: "AHK Copper Complex", dosage: "100mg Vial", price: 44.95, originalPrice: 54.95, discount: 18, image: "/assets/products/asset 11.png", rating: 4.7, reviews: 41 },
    { id: "a5", name: "SNAP-8 Peptide", dosage: "200mg Vial", price: 39.95, image: "/assets/products/asset 12.png", rating: 4.5, reviews: 28 },
]

function CategorySection({ title, href, products }: { title: string; href: string; products: Product[] }) {
    return (
        <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{title}</h3>
                <Link href={href} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                    See All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={() => { }} onQuickView={() => { }} />
                ))}
            </div>
        </div>
    )
}

export default function CategoryProducts() {
    return (
        <section className="py-8 sm:py-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CategorySection title="Recovery & Healing" href="/categories/recovery" products={recoveryProducts} />
                <CategorySection title="Muscle & Growth" href="/categories/muscle-growth" products={growthProducts} />
                <CategorySection title="Anti-Aging & Longevity" href="/categories/anti-aging" products={antiAgingProducts} />
            </div>
        </section>
    )
}
