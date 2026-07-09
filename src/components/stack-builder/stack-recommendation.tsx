"use client"

import React from "react"
import { X, ShoppingCart, Truck, RotateCcw } from "lucide-react"
import { GoalStack, StackProduct } from "@lib/stack-builder-data"

interface Props {
  goal: GoalStack
  products: StackProduct[]
  onRemove: (productId: string) => void
  onAddToCart: () => void
  onReset: () => void
}

const FREE_SHIPPING_THRESHOLD = 200

export default function StackRecommendation({
  goal,
  products,
  onRemove,
  onAddToCart,
  onReset,
}: Props) {
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0)
  const totalOriginalPrice = products.reduce(
    (sum, p) => sum + (p.originalPrice || p.price),
    0
  )
  const totalSavings = totalOriginalPrice - totalPrice
  const shippingProgress = Math.min(totalPrice, FREE_SHIPPING_THRESHOLD)
  const shippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          Step 2 of 2 — Your Recommended Stack
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {goal.title} Stack
        </h2>
        <p className="text-sm text-gray-500">
          {goal.description}. Remove any items you don&apos;t want — nothing is
          locked in.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product list */}
        <div className="lg:col-span-2 space-y-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">
                You&apos;ve removed all products from this stack.
              </p>
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Product Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-14 sm:max-h-16 object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                        {product.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {product.dosage}
                      </p>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => onRemove(product.id)}
                      className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200 flex items-center justify-center transition-colors flex-shrink-0"
                      title="Remove from stack"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-1 leading-relaxed">
                    {product.role}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar — Summary & Add to Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Stack Summary
            </h3>

            {/* Items count */}
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Items</span>
              <span className="font-medium text-gray-700">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Savings */}
            {totalSavings > 0 && (
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">You Save</span>
                <span className="font-medium text-emerald-600">
                  -${totalSavings.toFixed(2)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3 mb-4">
              <span className="text-sm font-semibold text-gray-900">
                Stack Total
              </span>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
                {totalSavings > 0 && (
                  <span className="block text-xs text-gray-400 line-through">
                    ${totalOriginalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Free shipping progress */}
            <div className="mb-5">
              {shippingRemaining > 0 ? (
                <>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Free shipping progress
                    </span>
                    <span className="font-medium text-gray-600">
                      ${shippingRemaining.toFixed(0)} away
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(shippingProgress / FREE_SHIPPING_THRESHOLD) * 100}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 rounded-lg px-3 py-2">
                  <Truck className="w-4 h-4" />
                  You qualify for free shipping!
                </div>
              )}
            </div>

            {/* Add to Cart button */}
            <button
              onClick={onAddToCart}
              disabled={products.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add Stack to Cart
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              You can always modify items in your cart later
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
