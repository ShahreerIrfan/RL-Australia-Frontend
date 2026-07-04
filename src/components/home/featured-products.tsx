"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Heart, Star, ShoppingCart, ArrowRight, Eye } from "lucide-react"
import CartDrawer, { CartItem } from "./cart-drawer"
import QuickViewModal from "./quick-view-modal"

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

const products: Product[] = [
    { id: "1", name: "BPC-157 (Body Protective)", dosage: "5mg Vial", price: 49.95, originalPrice: 64.95, discount: 23, image: "/assets/products/asset 6.png", rating: 4.9, reviews: 128 },
    { id: "2", name: "TB-500 (Thymosin Beta)", dosage: "5mg Vial", price: 54.95, originalPrice: 69.95, discount: 21, image: "/assets/products/asset 7.png", rating: 4.8, reviews: 96 },
    { id: "3", name: "CJC-1295 (No DAC)", dosage: "2mg Vial", price: 44.95, originalPrice: 59.95, discount: 25, image: "/assets/products/asset 8.png", rating: 4.7, reviews: 84 },
    { id: "4", name: "Ipamorelin Acetate", dosage: "5mg Vial", price: 39.95, image: "/assets/products/asset 9.png", rating: 4.8, reviews: 112 },
    { id: "5", name: "GHK-Cu (Copper Peptide)", dosage: "50mg Vial", price: 69.95, originalPrice: 89.95, discount: 22, image: "/assets/products/asset 10.png", rating: 4.9, reviews: 67 },
    { id: "6", name: "Sermorelin Acetate", dosage: "2mg Vial", price: 42.95, originalPrice: 54.95, discount: 22, image: "/assets/products/asset 11.png", rating: 4.6, reviews: 73 },
    { id: "7", name: "PT-141 (Bremelanotide)", dosage: "10mg Vial", price: 46.95, image: "/assets/products/asset 12.png", rating: 4.7, reviews: 58 },
    { id: "8", name: "Melanotan II", dosage: "10mg Vial", price: 34.95, originalPrice: 44.95, discount: 22, image: "/assets/products/asset 13.png", rating: 4.5, reviews: 91 },
]

export default function FeaturedProducts() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [wishlist, setWishlist] = useState<string[]>([])
    const [addingId, setAddingId] = useState<string | null>(null)
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

    const addToCart = (product: Product) => {
        setAddingId(product.id)
        setTimeout(() => {
            setCartItems((prev) => {
                const existing = prev.find((item) => item.id === product.id)
                if (existing) {
                    return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
                }
                return [...prev, { id: product.id, name: product.name, dosage: product.dosage, price: product.price, image: product.image, quantity: 1 }]
            })
            setAddingId(null)
            setIsCartOpen(true)
        }, 400)
    }

    const toggleWishlist = (id: string) => {
        setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
    }

    return (
        <>
            <section className="py-8 sm:py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-5 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Featured Peptides</h2>
                        <Link href="/store" className="text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200">
                                {/* Image area */}
                                <div className="relative p-3 pb-1">
                                    {product.discount && (
                                        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded z-10">
                                            {product.discount}% off
                                        </span>
                                    )}

                                    {/* Wishlist + Quick View */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
                                        <button
                                            onClick={() => toggleWishlist(product.id)}
                                            className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors"
                                            title="Wishlist"
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                                        </button>
                                        <button
                                            onClick={() => setQuickViewProduct(product)}
                                            className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:border-gray-300 transition-colors"
                                            title="Quick View"
                                        >
                                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center h-24 sm:h-32 lg:h-36 my-1">
                                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="px-3 pb-3">
                                    <h3 className="text-[11px] sm:text-xs font-medium text-gray-800 leading-snug mb-1 line-clamp-2 min-h-[2.2em]">
                                        {product.name}
                                    </h3>
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
                                        onClick={() => addToCart(product)}
                                        disabled={addingId === product.id}
                                        className={`w-full flex items-center justify-center gap-1.5 text-white text-[11px] sm:text-xs font-medium py-2 sm:py-2.5 rounded-lg transition-all duration-300 ${addingId === product.id
                                            ? "bg-emerald-400 scale-95"
                                            : "bg-emerald-500 hover:bg-emerald-600"
                                            }`}
                                    >
                                        {addingId === product.id ? (
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
                        ))}
                    </div>
                </div>
            </section>

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={(id, qty) => {
                    if (qty <= 0) setCartItems((prev) => prev.filter((item) => item.id !== id))
                    else setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: qty } : item))
                }}
                onRemove={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
            />

            <QuickViewModal
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                product={quickViewProduct}
                onAddToCart={() => {
                    if (quickViewProduct) addToCart(quickViewProduct)
                }}
            />
        </>
    )
}
