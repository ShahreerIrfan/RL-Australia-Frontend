"use client"

import React from "react"
import { X, Star, ShoppingCart, Minus, Plus } from "lucide-react"

interface QuickViewProps {
    isOpen: boolean
    onClose: () => void
    product: {
        name: string
        dosage: string
        price: number
        originalPrice?: number
        image: string
        rating: number
        reviews: number
    } | null
    onAddToCart: () => void
}

export default function QuickViewModal({ isOpen, onClose, product, onAddToCart }: QuickViewProps) {
    const [quantity, setQuantity] = React.useState(1)

    if (!isOpen || !product) return null

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40 z-[80]" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[90] p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Close button */}
                    <div className="flex justify-end p-3">
                        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="px-5 sm:px-6 pb-6">
                        <div className="grid sm:grid-cols-2 gap-5">
                            {/* Image */}
                            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center">
                                <img src={product.image} alt={product.name} className="w-40 h-40 object-contain" />
                            </div>

                            {/* Info */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h2>
                                <p className="text-sm text-gray-400 mb-3">{product.dosage}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                    High-purity research peptide. Lyophilized powder, third-party tested with full COA documentation included.
                                    For laboratory research use only.
                                </p>

                                {/* Quantity */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-sm font-medium text-gray-700">Qty:</span>
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <Minus className="w-3 h-3 text-gray-500" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <Plus className="w-3 h-3 text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Add to cart */}
                                <button
                                    onClick={() => { onAddToCart(); onClose() }}
                                    className="w-full flex items-center justify-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart — ${(product.price * quantity).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
