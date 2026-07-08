"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@components/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import {
  MapPin,
  Truck,
  CreditCard,
  Banknote,
  ShieldCheck,
  Ticket,
  Plus,
  Minus,
  Trash2,
  FileText,
  Loader2,
  ArrowLeft
} from "lucide-react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

export default function UnifiedCheckout() {
  const router = useRouter()
  const [cart, setCart] = useState<any>(null)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>("")
  const [selectedPayment, setSelectedPayment] = useState<string>("manual")
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Form Fields
  const [fullName, setFullName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [district, setDistrict] = useState<string>("")
  const [postalCode, setPostalCode] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [orderNote, setOrderNote] = useState<string>("")

  // Fetch cart details client-side
  const getCartId = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("rl_cart_id")
  }

  const fetchCart = useCallback(async () => {
    const cartId = getCartId()
    if (!cartId) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
        
        // Prefill form from cart address if already set
        if (data.cart.shipping_address) {
          const addr = data.cart.shipping_address
          const name = [addr.first_name, addr.last_name].filter(Boolean).join(" ")
          if (name) setFullName(name)
          if (addr.phone) setPhone(addr.phone)
          if (addr.city) setDistrict(addr.city)
          if (addr.postal_code) setPostalCode(addr.postal_code)
          if (addr.address_1) setAddress(addr.address_1)
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch shipping options
  const fetchShippingOptions = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/store/shipping-options`)
      if (res.ok) {
        const data = await res.json()
        setShippingOptions(data.shipping_options || [])
        if (data.shipping_options?.length > 0) {
          setSelectedShipping(data.shipping_options[0].id)
        }
      }
    } catch (err) {
      console.error("Failed to load shipping options:", err)
    }
  }, [])

  useEffect(() => {
    fetchCart()
    fetchShippingOptions()
  }, [fetchCart, fetchShippingOptions])

  // Update line item quantity
  const handleUpdateQty = async (itemId: string, newQty: number) => {
    const cartId = getCartId()
    if (!cartId || newQty <= 0) return
    try {
      const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty })
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (err) {
      console.error("Qty update error:", err)
    }
  }

  // Delete line item
  const handleDeleteItem = async (itemId: string) => {
    const cartId = getCartId()
    if (!cartId) return
    try {
      const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items/${itemId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (err) {
      console.error("Delete item error:", err)
    }
  }

  // Submit Order flow
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cartId = getCartId()
    if (!cartId) {
      setError("No active cart session found.")
      return
    }

    if (!fullName || !phone || !district || !address) {
      setError("Please fill in all required fields (Full Name, Phone, District, and Address).")
      return
    }

    setSubmitting(true)

    try {
      // 1. Update Address (Split Name)
      const nameParts = fullName.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || firstName

      const addrRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cart?.email || `${phone}@rlaustralia.com`,
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            address_1: address,
            city: district,
            province: district,
            postal_code: postalCode || "0000",
            phone: phone,
            country_code: "au"
          },
          billing_address: {
            first_name: firstName,
            last_name: lastName,
            address_1: address,
            city: district,
            province: district,
            postal_code: postalCode || "0000",
            phone: phone,
            country_code: "au"
          }
        })
      })

      if (!addrRes.ok) {
        throw new Error("Failed to save shipping address.")
      }

      // 2. Select Shipping Method
      if (selectedShipping) {
        const shipRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/shipping-methods`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ option_id: selectedShipping })
        })
        if (!shipRes.ok) {
          throw new Error("Failed to configure shipping option.")
        }
      }

      // 3. Initiate Payment Session
      const payRes = await fetch(`${BACKEND_URL}/store/payment-collections/${cartId}/payment-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_id: selectedPayment })
      })
      if (!payRes.ok) {
        throw new Error("Failed to set payment method.")
      }

      // 4. Complete Checkout (Place Order)
      const completeRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      if (!completeRes.ok) {
        throw new Error("Failed to complete order. Please try again.")
      }

      const completeData = await completeRes.json()

      if (completeData.type === "order") {
        // Clear local session storage
        localStorage.removeItem("rl_cart_id")
        document.cookie = "_medusa_cart_id=; path=/; max-age=-1"
        window.dispatchEvent(new Event("cart-updated"))

        // Redirect to confirmation page
        router.push(`/au/order/${completeData.order.id}/confirmed`)
      } else {
        throw new Error("Unexpected API order placement response.")
      }

    } catch (err: any) {
      console.error(err)
      setError(err.message || "An error occurred while placing your order.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading checkout session...</p>
      </div>
    )
  }

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const shippingTotal = cart?.shipping_total || 0
  const total = subtotal + shippingTotal
  const currencyCode = cart?.currency_code || "aud"

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 select-none">
          <div className="flex flex-col gap-1.5">
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
              <LocalizedClientLink href="/" className="hover:text-gray-900 transition-colors">Home</LocalizedClientLink>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-extrabold">Checkout</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
          </div>
          <LocalizedClientLink
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to shopping cart
          </LocalizedClientLink>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-xs">
            <h2 className="text-lg font-black text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Add some products to your cart to proceed with checkout.</p>
            <LocalizedClientLink href="/store" className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors">
              Browse Products
            </LocalizedClientLink>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Shipping Address Container */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-gray-900">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Phone *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01755074517"
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">District / State *</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Dhaka or New South Wales"
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Postal Code (Optional)</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 1205"
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your detailed address (house, road, area)"
                      className="w-full p-4 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Delivery Method */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-gray-900">Delivery Method</h2>
                </div>

                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      onClick={() => setSelectedShipping(option.id)}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all select-none ${
                        selectedShipping === option.id
                          ? "border-sky-500 bg-sky-50/20 shadow-xs"
                          : "border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedShipping === option.id ? "border-sky-600" : "border-gray-300"}`}>
                          {selectedShipping === option.id && <div className="w-2 h-2 rounded-full bg-sky-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{option.name}</p>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">Estimated delivery: 1-3 days</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-gray-800">
                        {convertToLocale({ amount: option.amount / 100, currency_code: currencyCode })}
                      </span>
                    </label>
                  ))}
                  {shippingOptions.length === 0 && (
                    <p className="text-xs text-gray-400 font-bold italic">No delivery methods available.</p>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#c5a059]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setSelectedPayment("manual")}
                    className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all select-none ${
                      selectedPayment === "manual"
                        ? "border-sky-500 bg-sky-50/20 shadow-xs"
                        : "border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === "manual" ? "border-sky-600" : "border-gray-300"}`}>
                        {selectedPayment === "manual" && <div className="w-2 h-2 rounded-full bg-sky-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                        <Banknote className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className="text-xs text-gray-450 font-semibold mt-1">Pay with cash when you receive your order</p>
                    </div>
                  </label>

                  {/* Paytree Payment gateway */}
                  <label
                    onClick={() => setSelectedPayment("paytree")}
                    className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all select-none ${
                      selectedPayment === "paytree"
                        ? "border-sky-500 bg-sky-50/20 shadow-xs"
                        : "border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="pt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPayment === "paytree" ? "border-sky-600" : "border-gray-300"}`}>
                        {selectedPayment === "paytree" && <div className="w-2 h-2 rounded-full bg-sky-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">Paytree Payment gateway</p>
                        <ShieldCheck className="w-5 h-5 text-sky-600" />
                      </div>
                      <p className="text-xs text-gray-450 font-semibold mt-1">Pay securely with bKash, Nagad, cards, and more via Paytree</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes (Optional) */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-gray-900">Order Note (Optional)</h2>
                </div>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors resize-none"
                />
              </div>

            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 select-none">
              
              <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-gray-900">Order Summary</h2>
                  <span className="bg-sky-50 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full border border-sky-100">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items preview list with inline adjustments */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex gap-3 items-center justify-between">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={item.thumbnail || "/assets/peptide-vial.png"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-gray-800 truncate max-w-[120px]">{item.title}</p>
                          {item.variant?.title && item.variant.title !== "Default" && (
                            <p className="text-[10px] text-gray-400 font-bold">{item.variant.title}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Quantity adjusts */}
                        <div className="flex items-center border border-gray-200 bg-gray-50/50 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-gray-850">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <span className="text-xs font-bold text-gray-900">
                          {convertToLocale({ amount: (item.unit_price * item.quantity), currency_code: currencyCode })}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <button type="button" className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 transition-all">
                  <span className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-sky-600" /> Have a promo code?
                  </span>
                  <span className="text-gray-400">&rarr;</span>
                </button>

                {/* Pricing summary */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-extrabold text-gray-900">
                      {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                    <span>Shipping</span>
                    <span className="font-extrabold text-gray-900">
                      {shippingTotal > 0
                        ? convertToLocale({ amount: shippingTotal, currency_code: currencyCode })
                        : "Calculated next"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm font-black text-gray-900">Total</span>
                  <span className="text-lg sm:text-xl font-black text-gray-900">
                    {convertToLocale({ amount: total, currency_code: currencyCode })}
                  </span>
                </div>

                {/* Place Order submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-sky-650 hover:bg-sky-700 text-white py-3.5 rounded-2xl text-sm font-bold transition-colors shadow-lg shadow-sky-600/15 disabled:opacity-60 border-b-2 border-sky-850"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>

                {error && (
                  <p className="text-xs text-rose-500 font-extrabold bg-rose-50 border border-rose-100 rounded-xl p-3 select-text">
                    ⚠️ {error}
                  </p>
                )}
              </div>

              {/* Secure Info footer */}
              <div className="text-[10px] text-gray-400 font-bold text-center flex items-center justify-center gap-1.5 select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Your transaction is 100% encrypted & secure.
              </div>

            </div>
          </form>
        )}
      </div>
    </div>
  )
}
