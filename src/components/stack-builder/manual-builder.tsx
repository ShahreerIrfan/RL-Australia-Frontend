"use client"

import React, { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart, Truck, X } from "lucide-react"
import { allProducts, StackProduct } from "@lib/stack-builder-data"

interface Props {
  onAddToCart: (products: StackProduct[]) => void
}

export default function ManualBuilder({ onAddToCart }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<StackProduct[]>([])
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200)

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    fetch(`${BACKEND_URL}/store/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.settings?.free_shipping_threshold) {
          setFreeShippingThreshold(parseFloat(data.settings.free_shipping_threshold) || 200)
        }
      })
      .catch(err => console.error("Error loading shipping settings:", err))
  }, [])

  const isInStack = (productId: string) =>
    selectedProducts.some((p) => p.id === productId)

  const addToStack = (product: StackProduct) => {
    if (!isInStack(product.id)) {
      setSelectedProducts((prev) => [...prev, product])
    }
  }

  const removeFromStack = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0)
  const shippingRemaining = Math.max(freeShippingThreshold - totalPrice, 0)

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          Manual Build Mode
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Build Your Own Stack
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Browse all products and add them to your custom stack. No
          pre-selected recommendations — you choose everything.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product catalog */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allProducts.map((product) => {
              const inStack = isInStack(product.id)
              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl border p-4 flex items-center gap-3 transition-all ${
                    inStack
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  }`}
                >
                  {/* Image */}
                  <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-10 object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                      {product.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5 truncate">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-500">{product.dosage}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add/Remove button */}
                  {inStack ? (
                    <button
                      onClick={() => removeFromStack(product.id)}
                      className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                      title="Remove from stack"
                    >
                      <Minus className="w-4 h-4 text-red-500" />
                    </button>
                  ) : (
                    <button
                      onClick={() => addToStack(product)}
                      className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors flex-shrink-0"
                      title="Add to stack"
                    >
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar — Stack summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Your Custom Stack
            </h3>

            {selectedProducts.length === 0 ? (
              <p className="text-xs text-gray-400 mb-4">
                No products added yet. Browse the catalog and click + to add
                items.
              </p>
            ) : (
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromStack(product.id)}
                      className="w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mb-4">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Free shipping progress */}
            <div className="mb-5">
              {shippingRemaining > 0 ? (
                <>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Free shipping
                    </span>
                    <span className="font-medium text-gray-600">
                      ${shippingRemaining.toFixed(0)} away
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(Math.min(totalPrice, freeShippingThreshold) / freeShippingThreshold) * 100}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 rounded-lg px-3 py-2">
                  <Truck className="w-4 h-4" />
                  Free shipping unlocked!
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => onAddToCart(selectedProducts)}
              disabled={selectedProducts.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add {selectedProducts.length || ""} to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
