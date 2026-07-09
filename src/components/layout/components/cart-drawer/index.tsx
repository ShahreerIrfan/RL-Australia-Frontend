"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, Trash2, Lock, ArrowRight } from "lucide-react"

interface CartItem {
  id: string
  title: string
  thumbnail: string
  quantity: number
  unit_price: number
  total: number
  product_handle: string
  product_title: string
  variant?: { title: string }
}

interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  shipping_total: number
  total: number
  currency_code: string
  item_total: number
}

const CART_API = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const FREE_SHIPPING_THRESHOLD = 200

const cartFetch = (url: string, init?: RequestInit) => {
  const headers = {
    ...init?.headers,
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
  }
  return fetch(url, { ...init, headers })
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [productMap, setProductMap] = useState<Record<string, string>>({})

  // Fetch all product slugs for upsells
  useEffect(() => {
    fetch(`${CART_API}/store/products`)
      .then(res => res.json())
      .then(data => {
        const map: Record<string, string> = {}
        data.products?.forEach((p: any) => {
          map[p.slug] = p.variants?.[0]?.id || p.id
        })
        setProductMap(map)
      })
      .catch(err => console.error("Error loading products for upsell:", err))
  }, [])

  // Sync cart updates with the rest of the storefront (badge counts, loaders, etc.)
  useEffect(() => {
    if (cart) {
      window.dispatchEvent(new Event("cart-updated"))
    }
  }, [cart])

  const getCartId = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("rl_cart_id")
  }

  const setCartId = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rl_cart_id", id)
      document.cookie = `_medusa_cart_id=${id}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
  }

  const fetchCart = useCallback(async () => {
    const cartId = getCartId()
    if (!cartId) return
    if (typeof window !== "undefined") {
      document.cookie = `_medusa_cart_id=${cartId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
    try {
      const res = await cartFetch(`${CART_API}/store/carts/${cartId}`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err)
    }
  }, [])

  const createCart = async (): Promise<string> => {
    const res = await cartFetch(`${CART_API}/store/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region_id: "reg_au" })
    })
    const data = await res.json()
    setCartId(data.cart.id)
    setCart(data.cart)
    return data.cart.id
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    setLoading(true)
    try {
      let cartId = getCartId()
      if (!cartId) {
        cartId = await createCart()
      }
      const res = await cartFetch(`${CART_API}/store/carts/${cartId}/line-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: productId, quantity })
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
        setIsOpen(true)
      } else {
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (err) {
      console.error("Failed to add to cart:", err)
      window.dispatchEvent(new Event("cart-updated"))
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (lineId: string, quantity: number) => {
    const cartId = getCartId()
    if (!cartId) return
    setUpdatingItem(lineId)
    try {
      if (quantity <= 0) {
        await cartFetch(`${CART_API}/store/carts/${cartId}/line-items/${lineId}`, { method: "DELETE" })
      } else {
        await cartFetch(`${CART_API}/store/carts/${cartId}/line-items/${lineId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity })
        })
      }
      await fetchCart()
    } catch (err) {
      console.error("Failed to update quantity:", err)
    } finally {
      setUpdatingItem(null)
    }
  }

  const removeItem = async (lineId: string) => {
    const cartId = getCartId()
    if (!cartId) return
    setUpdatingItem(lineId)
    try {
      await cartFetch(`${CART_API}/store/carts/${cartId}/line-items/${lineId}`, { method: "DELETE" })
      await fetchCart()
    } catch (err) {
      console.error("Failed to remove item:", err)
    } finally {
      setUpdatingItem(null)
    }
  }

  // Listen for custom events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    const handleAdd = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.productId) {
        addToCart(detail.productId, detail.quantity || 1)
      }
    }
    const handleCartUpdate = () => fetchCart()

    window.addEventListener("open-cart-drawer", handleOpen)
    window.addEventListener("add-to-cart", handleAdd as EventListener)
    window.addEventListener("cart-updated", handleCartUpdate)

    // Initial fetch
    fetchCart()

    return () => {
      window.removeEventListener("open-cart-drawer", handleOpen)
      window.removeEventListener("add-to-cart", handleAdd as EventListener)
      window.removeEventListener("cart-updated", handleCartUpdate)
    }
  }, [fetchCart])

  const UPSELL_ITEMS = [
    {
      name: "Beef Liver Pills",
      slug: "beef-liver-pills",
      price: 19.99,
      wasPrice: 24.99,
      hook: "Nature's multivitamin: B12, iron & folate in one tiny pill."
    },
    {
      name: "Glycine",
      slug: "glycine",
      price: 17.99,
      wasPrice: 21.99,
      hook: "The sleep-and-skin amino acid your stack is missing."
    },
    {
      name: "CoQ10",
      slug: "coq10",
      price: 18.99,
      wasPrice: 23.99,
      hook: "Mitochondrial fuel for energy that actually lasts."
    },
    {
      name: "NMN",
      slug: "nmn",
      price: 22.99,
      wasPrice: 28.99,
      hook: "The NAD+ booster everyone's stacking for longevity."
    },
    {
      name: "Creatine Gummies",
      slug: "protein-creatine-gummies",
      price: 16.99,
      wasPrice: 19.99,
      hook: "Gains in gummy form. No shaker, no excuses."
    },
    {
      name: "L. Reuteri",
      slug: "l-reuteri",
      price: 20.99,
      wasPrice: 25.99,
      hook: "Gut health meets feel-good hormones."
    }
  ]

  const addSingleUpsell = async (slug: string) => {
    const variantId = productMap[slug]
    if (!variantId) return
    setLoading(true)
    try {
      let cartId = getCartId()
      if (!cartId) {
        cartId = await createCart()
      }
      const res = await cartFetch(`${CART_API}/store/carts/${cartId}/line-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: variantId, quantity: 1 })
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
      }
    } catch (err) {
      console.error("Error adding upsell:", err)
    } finally {
      setLoading(false)
    }
  }

  const addAllUpsells = async () => {
    setLoading(true)
    try {
      let cartId = getCartId()
      if (!cartId) {
        cartId = await createCart()
      }
      for (const item of UPSELL_ITEMS) {
        const variantId = productMap[item.slug]
        if (variantId) {
          await cartFetch(`${CART_API}/store/carts/${cartId}/line-items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ variant_id: variantId, quantity: 1 })
          })
        }
      }
      await fetchCart()
    } catch (err) {
      console.error("Error adding all upsells:", err)
    } finally {
      setLoading(false)
    }
  }

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const subtotal = cart?.subtotal || 0
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-gray-900">Shopping Cart</h2>
            {totalItems > 0 && (
              <span className="bg-emerald-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {totalItems > 0 && (
          <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-100">
            <p className="text-xs text-gray-600 mb-2 font-medium">
              {remaining > 0 ? (
                <>Add <span className="font-bold text-sky-600">${remaining.toFixed(2)}</span> more for <span className="font-bold text-sky-600">free delivery</span></>
              ) : (
                <span className="font-bold text-sky-605">🎉 You qualify for free delivery!</span>
              )}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Browse our products and add items to get started</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart?.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-3 rounded-2xl border border-gray-100 bg-white shadow-sm transition-opacity ${
                    updatingItem === item.id ? "opacity-50" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/assets/peptide-vial.png" }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.product_title || item.title}</p>
                    {item.variant?.title && item.variant.title !== "Default" && (
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.variant.title}</p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          disabled={updatingItem === item.id}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-800 border-x border-gray-200 bg-gray-50/50">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          disabled={updatingItem === item.id}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-gray-900">${item.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-300 hover:text-rose-500 transition-colors flex-shrink-0"
                    disabled={updatingItem === item.id}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Checkout Upsell Rail */}
              <div className="mt-8 border-t border-dashed border-gray-200 pt-6 text-left">
                <div className="flex items-center justify-between mb-3.5">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">Complete Your Stack</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Highly recommended additions under $25</p>
                  </div>
                </div>

                {/* Horizontal Scroll Rail */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin select-none">
                  {UPSELL_ITEMS.map((item, idx) => {
                    const isInCart = cart?.items?.some(i => i.product_handle === item.slug || i.product_title?.toLowerCase().includes(item.name.toLowerCase()))
                    const variantId = productMap[item.slug]
                    return (
                      <div key={idx} className="flex-shrink-0 w-[155px] bg-gray-50/50 border border-gray-150 rounded-xl p-3 flex flex-col justify-between hover:bg-gray-50/80 transition-colors">
                        <div>
                          <span className="font-bold text-gray-800 text-[11px] block truncate">{item.name}</span>
                          <span className="text-[9px] text-gray-400 font-bold block leading-tight mt-1 line-clamp-2 h-6">{item.hook}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-gray-400 line-through font-bold leading-none">${item.wasPrice}</span>
                            <span className="text-xs font-black text-[#c5a059] mt-0.5">${item.price}</span>
                          </div>
                          <button
                            onClick={() => addSingleUpsell(item.slug)}
                            disabled={loading || !variantId || isInCart}
                            className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all ${
                              isInCart
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-sky-600 hover:bg-sky-700 text-white hover:shadow-md hover:shadow-sky-600/10"
                            }`}
                          >
                            {isInCart ? "Added" : "+ Add"}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add All CTA */}
                <button
                  onClick={addAllUpsells}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 text-gray-700 hover:text-gray-900 py-2.5 rounded-xl text-xs font-bold transition-all mt-1"
                >
                  ⚡ Add all to cart — $112.94 <span className="text-gray-400 line-through font-medium">$141.94</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {totalItems > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="text-xs font-semibold text-sky-605">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between text-base pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-gray-900 text-lg">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
             <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-2xl text-sm font-bold transition-colors shadow-lg shadow-sky-600/20 border-b-2 border-sky-850"
            >
              <ShoppingBag className="w-4 h-4" />
              Proceed to Checkout
            </Link>

            {/* View Full Cart */}
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              View Full Cart <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Security Note */}
            <p className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
              <Lock className="w-3 h-3" /> Secure & encrypted checkout
            </p>
          </div>
        )}
      </div>
    </>
  )
}
