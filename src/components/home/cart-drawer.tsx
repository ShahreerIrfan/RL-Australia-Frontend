"use client"

import React from "react"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"

export interface CartItem {
    id: string
    name: string
    dosage: string
    price: number
    image: string
    quantity: number
}

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
    items: CartItem[]
    onUpdateQuantity: (id: string, quantity: number) => void
    onRemove: (id: string) => void
}

export default function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartDrawerProps) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const freeShippingThreshold = 200
    const remaining = Math.max(0, freeShippingThreshold - subtotal)

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gray-700" />
                        <h2 className="text-base font-semibold text-gray-900">Your Cart</h2>
                        <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {items.length} {items.length === 1 ? "item" : "items"}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Free shipping bar */}
                {items.length > 0 && (
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                        {remaining > 0 ? (
                            <>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-600">Add <strong className="text-gray-900">${remaining.toFixed(2)}</strong> more for free shipping</span>
                                    <span className="text-gray-400">${subtotal.toFixed(2)} / $200</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-teal-700 font-medium text-center">🎉 You&apos;ve unlocked free shipping!</p>
                        )}
                    </div>
                )}

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-sm text-gray-500 mb-1">Your cart is empty</p>
                            <p className="text-xs text-gray-400 mb-6">Add some products to get started</p>
                            <button
                                onClick={onClose}
                                className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                            >
                                Continue Shopping →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                                    {/* Image */}
                                    <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                        <p className="text-xs text-gray-400 mb-2">{item.dosage}</p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                                            >
                                                <Minus className="w-3 h-3 text-gray-500" />
                                            </button>
                                            <span className="text-xs font-medium text-gray-700 w-5 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors"
                                            >
                                                <Plus className="w-3 h-3 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price + Remove */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            className="text-gray-300 hover:text-red-400 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-semibold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Subtotal</span>
                            <span className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                            onClick={onClose}
                        >
                            Proceed to Checkout
                        </Link>
                        <button
                            onClick={onClose}
                            className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
