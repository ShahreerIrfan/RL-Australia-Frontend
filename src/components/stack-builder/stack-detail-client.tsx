"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft, ShoppingCart, Truck, Loader2,
  Heart, Brain, Zap, Dumbbell, Target, Shield, Moon,
  Sparkles, Flame, Smile, Award, Activity, AlertCircle, Hourglass,
  X, Check,
} from "lucide-react"
import { goalStacks } from "@lib/stack-builder-data"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test"
const FREE_SHIPPING = 200

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Brain, Zap, Dumbbell, Target, Shield, Moon,
  Sparkles, Flame, Smile, Award, Activity, AlertCircle, Hourglass,
}

interface StackProduct {
  id: string
  name: string
  dosage: string
  price: number
  originalPrice?: number
  image: string
  variantId?: string
  handle?: string
}

interface GoalData {
  id: string
  icon: string
  goal_name: string
  description: string
  products: StackProduct[]
}

function parseProducts(raw: any[]): StackProduct[] {
  return raw.map((p: any) => {
    const variant = p.variants?.[0]
    const calcAmount = variant?.calculated_price?.calculated_amount
    // Backend stores prices as actual dollars (49.95), NOT cents
    const price = calcAmount ? Number(calcAmount) : (p.price ? Number(p.price) : 0)
    const originalAmount = variant?.calculated_price?.original_amount
    const originalPrice = originalAmount ? Number(originalAmount) : (p.original_price ? Number(p.original_price) : undefined)

    return {
      id: p.id,
      name: p.title || p.name,
      dosage: variant?.title || p.dosage || "",
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      image: p.thumbnail || p.image || "/assets/products/asset 6.png",
      variantId: variant?.id,
      handle: p.handle,
    }
  })
}

export default function StackDetailClient({ goalId }: { goalId: string }) {
  const [goal, setGoal] = useState<GoalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchGoal() {
      // 1. Try backend API first
      try {
        const res = await fetch(`${BACKEND_URL}/store/recommendations`, {
          headers: {
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
        })
        if (res.ok) {
          const data = await res.json()
          const found = (data.recommendations || []).find(
            (r: any) => r.id === goalId
          )
          if (found) {
            setGoal({
              id: found.id,
              icon: found.icon || "Heart",
              goal_name: found.goal_name,
              description: found.description || "",
              products: parseProducts(found.products || []),
            })
            setSelectedIds(
              new Set((found.products || []).map((p: any) => p.id))
            )
            setLoading(false)
            return
          }
        }
      } catch (e) {
        // fallthrough to static
      }

      // 2. Fallback to static data
      const staticGoal = goalStacks.find((g) => g.id === goalId)
      if (staticGoal) {
        const products = staticGoal.products.map((p) => ({
          id: p.id,
          name: p.name,
          dosage: p.dosage,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
        }))
        setGoal({
          id: staticGoal.id,
          icon: staticGoal.icon,
          goal_name: staticGoal.title,
          description: staticGoal.description,
          products,
        })
        setSelectedIds(new Set(products.map((p) => p.id)))
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }

    fetchGoal()
  }, [goalId])

  const selectedProducts = goal?.products.filter((p) =>
    selectedIds.has(p.id)
  ) || []

  const totalPrice = selectedProducts.reduce((s, p) => s + p.price, 0)
  const totalOriginal = selectedProducts.reduce(
    (s, p) => s + (p.originalPrice || p.price),
    0
  )
  const savings = totalOriginal - totalPrice
  const shippingLeft = Math.max(FREE_SHIPPING - totalPrice, 0)

  function toggleProduct(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleAddToCart() {
    if (selectedProducts.length === 0) return
    setAddingToCart(true)

    try {
      // Get or create cart
      let cartId = typeof window !== "undefined" ? localStorage.getItem("rl_cart_id") : null

      if (!cartId) {
        const createRes = await fetch(`${BACKEND_URL}/store/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ region_id: "reg_au" }),
        })
        if (createRes.ok) {
          const createData = await createRes.json()
          cartId = createData.cart.id
          if (typeof window !== "undefined") {
            localStorage.setItem("rl_cart_id", cartId!)
            document.cookie = `_medusa_cart_id=${cartId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          }
        } else {
          throw new Error("Failed to create cart")
        }
      }

      // Add each selected product to cart
      for (const product of selectedProducts) {
        const variantId = product.variantId || `var_${product.id}`
        await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variant_id: variantId, quantity: 1 }),
        })
      }

      // Trigger cart update event so the cart drawer refreshes
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"))
      }

      setCartAdded(true)
      setTimeout(() => setCartAdded(false), 3000)
    } catch (err) {
      console.error("Failed to add to cart:", err)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (notFound || !goal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-500">Stack option not found.</p>
        <Link
          href="/stack-builder"
          className="text-sm text-sky-600 hover:underline"
        >
          ← Back to Stack Builder
        </Link>
      </div>
    )
  }

  const Icon = iconMap[goal.icon] || Heart

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart success toast */}
      {cartAdded && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in-right">
          <Check className="w-4 h-4" />
          {selectedProducts.length} item{selectedProducts.length !== 1 ? "s" : ""} added to cart!
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/stack-builder"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stack Builder
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {goal.goal_name}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{goal.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product list — left/main */}
          <div className="lg:col-span-2">
            <p className="text-sm text-gray-500 mb-5">
              <span className="font-medium text-gray-700">
                {goal.products.length} products
              </span>{" "}
              in this stack. Uncheck any you don&apos;t want before adding to cart.
            </p>

            <div className="space-y-3">
              {goal.products.map((product) => {
                const isSelected = selectedIds.has(product.id)
                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl border p-4 sm:p-5 flex items-center gap-4 transition-all ${
                      isSelected
                        ? "border-gray-200 shadow-sm"
                        : "border-gray-100 opacity-50"
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </button>

                    {/* Product image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-14 sm:max-h-16 object-contain"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      {product.handle ? (
                        <Link
                          href={`/products/${product.handle}`}
                          className="text-sm sm:text-base font-semibold text-gray-900 hover:text-sky-600 transition-colors block truncate"
                        >
                          {product.name}
                        </Link>
                      ) : (
                        <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {product.name}
                        </p>
                      )}
                      {product.dosage && (
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                          {product.dosage}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove toggle */}
                    <button
                      onClick={() => toggleProduct(product.id)}
                      title={isSelected ? "Remove from stack" : "Add back"}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200"
                          : "bg-emerald-50 border border-emerald-200"
                      }`}
                    >
                      {isSelected ? (
                        <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      ) : (
                        <Check className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary sidebar — right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-5">
                Stack Summary
              </h3>

              {/* Selected items */}
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Items selected</span>
                <span className="font-medium text-gray-700">
                  {selectedProducts.length} / {goal.products.length}
                </span>
              </div>

              {/* Savings */}
              {savings > 0 && (
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">You Save</span>
                  <span className="font-semibold text-emerald-600">
                    -${savings.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-3 mb-5">
                <span className="text-sm font-semibold text-gray-900">
                  Stack Total
                </span>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </p>
                  {savings > 0 && (
                    <p className="text-xs text-gray-400 line-through">
                      ${totalOriginal.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Free shipping progress */}
              <div className="mb-5">
                {shippingLeft > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        Free shipping progress
                      </span>
                      <span className="font-medium text-gray-600">
                        ${shippingLeft.toFixed(0)} away
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (totalPrice / FREE_SHIPPING) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                    <Truck className="w-4 h-4" />
                    Free shipping unlocked!
                  </div>
                )}
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || selectedProducts.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {addingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {addingToCart
                  ? "Adding..."
                  : `Add ${selectedProducts.length} Item${selectedProducts.length !== 1 ? "s" : ""} to Cart`}
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-2">
                You can always modify items in your cart
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
