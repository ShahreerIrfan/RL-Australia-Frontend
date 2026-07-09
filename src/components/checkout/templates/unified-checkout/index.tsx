"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@components/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Ticket,
  Plus,
  Minus,
  Trash2,
  FileText,
  Loader2,
  ArrowLeft,
  ChevronRight
} from "lucide-react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

export default function UnifiedCheckout() {
  const router = useRouter()
  const [cart, setCart] = useState<any>(null)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedPayment, setSelectedPayment] = useState<string>("manual")
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [productMap, setProductMap] = useState<Record<string, string>>({})

  // Fetch all product slugs for upsells
  useEffect(() => {
    fetch(`${BACKEND_URL}/store/products`)
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

  const handleAddUpsell = async (slug: string) => {
    const variantId = productMap[slug] || slug
    const cartId = getCartId()
    if (!cartId) return
    try {
      const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: variantId, quantity: 1 })
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (err) {
      console.error("Error adding upsell:", err)
    }
  }

  const handleAddAllUpsells = async () => {
    const cartId = getCartId()
    if (!cartId) return
    try {
      for (const item of UPSELL_ITEMS) {
        const variantId = productMap[item.slug] || item.slug
        await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variant_id: variantId, quantity: 1 })
        })
      }
      await fetchCart()
      window.dispatchEvent(new Event("cart-updated"))
    } catch (err) {
      console.error("Error adding all upsells:", err)
    }
  }

  const handleToggleShippingProtection = async (enabled: boolean) => {
    const cartId = getCartId()
    if (!cartId) return
    try {
      const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/shipping-protection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled })
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data.cart)
        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (err) {
      console.error("Failed to update shipping protection:", err)
    }
  }

  // Shipping Form Fields
  const [fullName, setFullName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [district, setDistrict] = useState<string>("")
  const [postalCode, setPostalCode] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [orderNote, setOrderNote] = useState<string>("")

  // Billing Address Fields
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(true)
  const [billingCountry, setBillingCountry] = useState<string>("au")
  const [billingFirstName, setBillingFirstName] = useState<string>("")
  const [billingLastName, setBillingLastName] = useState<string>("")
  const [billingAddress1, setBillingAddress1] = useState<string>("")
  const [billingAddress2, setBillingAddress2] = useState<string>("")
  const [billingCity, setBillingCity] = useState<string>("")
  const [billingState, setBillingState] = useState<string>("")
  const [billingPostalCode, setBillingPostalCode] = useState<string>("")
  const [billingPhone, setBillingPhone] = useState<string>("")

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

        // Prefill Billing Address form if already set
        if (data.cart.billing_address && Object.keys(data.cart.billing_address).length > 0) {
          const bAddr = data.cart.billing_address
          const shipAddr = data.cart.shipping_address || {}
          
          const isSame = 
            bAddr.first_name === shipAddr.first_name &&
            bAddr.last_name === shipAddr.last_name &&
            bAddr.address_1 === shipAddr.address_1 &&
            bAddr.city === shipAddr.city &&
            bAddr.province === shipAddr.province &&
            bAddr.postal_code === shipAddr.postal_code &&
            bAddr.phone === shipAddr.phone
            
          setSameAsShipping(isSame)
          
          if (!isSame) {
            if (bAddr.country_code) setBillingCountry(bAddr.country_code)
            if (bAddr.first_name) setBillingFirstName(bAddr.first_name)
            if (bAddr.last_name) setBillingLastName(bAddr.last_name)
            if (bAddr.address_1) setBillingAddress1(bAddr.address_1)
            if (bAddr.address_2) setBillingAddress2(bAddr.address_2)
            if (bAddr.city) setBillingCity(bAddr.city)
            if (bAddr.province) setBillingState(bAddr.province)
            if (bAddr.postal_code) setBillingPostalCode(bAddr.postal_code)
            if (bAddr.phone) setBillingPhone(bAddr.phone)
          }
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

    if (!sameAsShipping && (!billingFirstName || !billingLastName || !billingAddress1 || !billingCity || !billingState || !billingPostalCode)) {
      setError("Please fill in all required billing fields.")
      return
    }

    setSubmitting(true)

    try {
      // 1. Update Address (Split Name)
      const nameParts = fullName.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || firstName

      // Billing Address payload configuration
      let billingAddressObj = {}
      if (sameAsShipping) {
        billingAddressObj = {
          first_name: firstName,
          last_name: lastName,
          address_1: address,
          city: district,
          province: district,
          postal_code: postalCode || "0000",
          phone: phone,
          country_code: "au"
        }
      } else {
        billingAddressObj = {
          first_name: billingFirstName,
          last_name: billingLastName,
          address_1: billingAddress1,
          address_2: billingAddress2 || "",
          city: billingCity,
          province: billingState,
          postal_code: billingPostalCode,
          phone: billingPhone || "",
          country_code: billingCountry
        }
      }

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
          billing_address: billingAddressObj
        })
      })

      if (!addrRes.ok) {
        throw new Error("Failed to save shipping address.")
      }

      // 2. Select default Shipping Method automatically behind the scenes
      const shippingOptionId = shippingOptions[0]?.id || "so_standard"
      const shipRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}/shipping-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option_id: shippingOptionId })
      })
      if (!shipRes.ok) {
        throw new Error("Failed to configure default shipping option.")
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
  const shippingTotal = shippingOptions[0]?.amount ? (shippingOptions[0].amount / 100) : 9.95
  const total = subtotal + shippingTotal
  const currencyCode = cart?.currency_code || "aud"

  return (
    <div className="bg-[#fbfafa] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 mb-8 select-none">
          <div className="space-y-2">
            <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              <LocalizedClientLink href="/" className="hover:text-gray-900 transition-colors">Home</LocalizedClientLink>
              <span>/</span>
              <span className="text-gray-900">Checkout</span>
            </nav>
            <h1 className="text-3xl font-black text-gray-950 tracking-tight">Checkout Details</h1>
          </div>
          <LocalizedClientLink
            href="/cart"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-gray-500 hover:text-gray-900 transition-colors mt-4 md:mt-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </LocalizedClientLink>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-xs">
            <h2 className="text-base font-black text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Add some products to your cart to proceed with checkout.</p>
            <LocalizedClientLink href="/store" className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors">
              Browse Products
            </LocalizedClientLink>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Checkout Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address */}
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 md:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
                  <div className="w-9 h-9 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">Shipping Details</h2>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Please provide where to deliver your package</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Phone *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01755074517"
                      className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">District / State *</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Sydney or Victoria"
                      className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all duration-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Postal Code (Optional)</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all duration-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Detailed Address *</label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your detailed street address (house/apartment, road, suburb)"
                      className="w-full p-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 md:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center text-[#c5a059]">
                    <CreditCard className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">Payment Option</h2>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Choose how you want to pay for this order</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setSelectedPayment("manual")}
                    className={`flex items-start gap-4 p-4 md:p-5 border rounded-2xl cursor-pointer transition-all select-none ${
                      selectedPayment === "manual"
                        ? "border-[#c5a059] bg-[#c5a059]/5 shadow-xs"
                        : "border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="pt-1">
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${selectedPayment === "manual" ? "border-[#c5a059]" : "border-gray-300"}`}>
                        {selectedPayment === "manual" && <div className="w-2.5 h-2.5 rounded-full bg-[#c5a059]" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                        <Banknote className="w-5 h-5 text-amber-500" />
                      </div>
                      <p className="text-xs text-gray-450 font-bold mt-1.5 leading-relaxed">Pay with cash when you receive your order</p>
                    </div>
                  </label>

                  {/* Paytree Payment gateway */}
                  <label
                    onClick={() => setSelectedPayment("paytree")}
                    className={`flex items-start gap-4 p-4 md:p-5 border rounded-2xl cursor-pointer transition-all select-none ${
                      selectedPayment === "paytree"
                        ? "border-[#c5a059] bg-[#c5a059]/5 shadow-xs"
                        : "border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="pt-1">
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${selectedPayment === "paytree" ? "border-[#c5a059]" : "border-gray-300"}`}>
                        {selectedPayment === "paytree" && <div className="w-2.5 h-2.5 rounded-full bg-[#c5a059]" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">Paytree Payment gateway</p>
                        <ShieldCheck className="w-5 h-5 text-sky-600" />
                      </div>
                      <p className="text-xs text-gray-450 font-bold mt-1.5 leading-relaxed">Pay securely with bKash, Nagad, cards, and more via Paytree</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Billing Address Card */}
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 flex items-center justify-center text-[#c5a059]">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">Billing Address</h2>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Specify your billing information if different</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Same as shipping address */}
                  <label
                    onClick={() => setSameAsShipping(true)}
                    className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all select-none ${
                      sameAsShipping
                        ? "border-[#c5a059] bg-[#c5a059]/5 shadow-xs"
                        : "border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${sameAsShipping ? "border-[#c5a059]" : "border-gray-300"}`}>
                      {sameAsShipping && <div className="w-2.5 h-2.5 rounded-full bg-[#c5a059]" />}
                    </div>
                    <span className="text-sm font-bold text-gray-900">Same as shipping address</span>
                  </label>

                  {/* Use a different billing address */}
                  <label
                    onClick={() => setSameAsShipping(false)}
                    className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all select-none ${
                      !sameAsShipping
                        ? "border-[#c5a059] bg-[#c5a059]/5 shadow-xs"
                        : "border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${!sameAsShipping ? "border-[#c5a059]" : "border-gray-300"}`}>
                      {!sameAsShipping && <div className="w-2.5 h-2.5 rounded-full bg-[#c5a059]" />}
                    </div>
                    <span className="text-sm font-bold text-gray-900">Use a different billing address</span>
                  </label>

                  {/* Expanded Billing Fields */}
                  {!sameAsShipping && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100 animate-fade-in-top">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Country / Region</label>
                        <select
                          value={billingCountry}
                          onChange={(e) => setBillingCountry(e.target.value)}
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-205"
                        >
                          <option value="au">Australia</option>
                          <option value="us">United States</option>
                          <option value="in">India</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">First Name *</label>
                        <input
                          type="text"
                          required={!sameAsShipping}
                          value={billingFirstName}
                          onChange={(e) => setBillingFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Last Name *</label>
                        <input
                          type="text"
                          required={!sameAsShipping}
                          value={billingLastName}
                          onChange={(e) => setBillingLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Address *</label>
                        <input
                          type="text"
                          required={!sameAsShipping}
                          value={billingAddress1}
                          onChange={(e) => setBillingAddress1(e.target.value)}
                          placeholder="Address (street address, P.O. box)"
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Apartment, suite, etc. (Optional)</label>
                        <input
                          type="text"
                          value={billingAddress2}
                          onChange={(e) => setBillingAddress2(e.target.value)}
                          placeholder="Apartment, suite, unit, etc."
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">City *</label>
                        <input
                          type="text"
                          required={!sameAsShipping}
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          placeholder="City"
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">State *</label>
                        <input
                          type="text"
                          required={!sameAsShipping}
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value)}
                          placeholder="State / Province"
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">PIN code / Postal code *</label>
                        <input
                          type="text"
                          required={!sameAsShipping}
                          value={billingPostalCode}
                          onChange={(e) => setBillingPostalCode(e.target.value)}
                          placeholder="PIN code"
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Phone (Optional)</label>
                        <input
                          type="text"
                          value={billingPhone}
                          onChange={(e) => setBillingPhone(e.target.value)}
                          placeholder="Phone"
                          className="w-full h-12 px-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#c5a059]/10 focus:border-[#c5a059] transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Note */}
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 md:p-8 shadow-xs">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
                  <div className="w-9 h-9 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900">Delivery Notes (Optional)</h2>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Add any instructions for the courier</p>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Leave package by the door if not home..."
                  className="w-full p-4 border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all duration-200 resize-none"
                />
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 select-none">
              
              <div className="bg-white rounded-3xl border border-gray-200/60 p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-black text-gray-900">Order Summary</h2>
                  <span className="bg-sky-50 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full border border-sky-100">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Free Shipping Progress */}
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 mb-5 text-left">
                  <p className="text-[11px] font-bold text-gray-700 mb-2">
                    {subtotal >= 200 ? (
                      <span className="text-emerald-700 font-extrabold">🎉 You qualify for free delivery!</span>
                    ) : (
                      <>Add <span className="text-sky-605 font-extrabold">{convertToLocale({ amount: (200 - subtotal), currency_code: currencyCode })}</span> more for <span className="text-sky-605 font-extrabold">free delivery</span></>
                    )}
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / 200) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pb-2">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center justify-between bg-gray-50/30 p-3 rounded-2xl border border-gray-100">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white flex-shrink-0 flex items-center justify-center">
                          <img
                            src={item.thumbnail || "/assets/peptide-vial.png"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-gray-900 truncate max-w-[140px]">{item.title}</p>
                          {item.variant?.title && item.variant.title !== "Default" && (
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.variant.title}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Minus/Plus toggles */}
                        <div className="flex items-center border border-gray-250 bg-white rounded-xl overflow-hidden shadow-xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 h-7 flex items-center justify-center text-xs font-black text-gray-800 border-x border-gray-150">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Totals & Trash */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-950">
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
                    </div>
                  ))}
                </div>

                {/* Promo Coupon Button */}
                <button type="button" className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 hover:text-gray-900 transition-all">
                  <span className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#c5a059]" /> Have a promo code?
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Shipping Protection checkbox */}
                <label className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-150 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={!!cart?.shipping_protection}
                      onChange={(e) => handleToggleShippingProtection(e.target.checked)}
                      className="w-4 h-4 rounded-lg border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer accent-sky-600"
                    />
                    <div className="flex flex-col text-left">
                      <span>Add Shipping Protection</span>
                      <span className="text-[9px] text-gray-400 font-bold leading-none mt-0.5">Covers loss, damage, or theft in transit</span>
                    </div>
                  </div>
                  <span className="text-gray-900 font-extrabold">+$6.50</span>
                </label>

                {/* Calculations details */}
                <div className="space-y-3 pt-4 border-t border-gray-100 text-left">
                  <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-extrabold text-gray-900">
                      {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
                    </span>
                  </div>
                  {cart?.shipping_protection && (
                    <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                      <span>Shipping Protection</span>
                      <span className="font-extrabold text-gray-900">
                        {convertToLocale({ amount: 6.50, currency_code: currencyCode })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                    <span>Shipping</span>
                    <span className="font-extrabold text-[#c5a059]">
                      {shippingTotal === 0 ? "FREE" : convertToLocale({ amount: shippingTotal, currency_code: currencyCode })}
                    </span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-150">
                  <span className="text-sm font-black text-gray-900">Total</span>
                  <span className="text-xl sm:text-2xl font-black text-gray-950">
                    {convertToLocale({ amount: total, currency_code: currencyCode })}
                  </span>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-sky-600/20 active:translate-y-0.5 disabled:opacity-60 border-b-2 border-[#025a87] text-center cursor-pointer"
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

                {/* Checkout Upsell Rail */}
                <div className="mt-6 border-t border-dashed border-gray-250 pt-5 text-left">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">Complete Your Stack</h3>

                  {/* Horizontal Scroll Rail */}
                  <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-thin select-none">
                    {UPSELL_ITEMS.map((item, idx) => {
                      const isInCart = items.some((i: any) => i.product_handle === item.slug || i.title?.toLowerCase().includes(item.name.toLowerCase()))
                      const variantId = productMap[item.slug]
                      return (
                        <div key={idx} className="flex-shrink-0 w-[140px] bg-gray-50/70 border border-gray-200 rounded-2xl p-3 flex flex-col justify-between hover:bg-gray-50 transition-colors">
                          <div>
                            <span className="font-bold text-gray-900 text-[10px] block truncate">{item.name}</span>
                            <span className="text-[8px] text-gray-400 font-bold block leading-tight mt-0.5 line-clamp-2 h-5.5">{item.hook}</span>
                          </div>
                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[8px] text-gray-400 line-through font-bold leading-none">${item.wasPrice}</span>
                              <span className="text-[10px] font-black text-[#c5a059] mt-0.5">${item.price}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddUpsell(item.slug)}
                              disabled={submitting || isInCart}
                              className={`px-2 py-0.5 text-[9px] font-black rounded-lg transition-all ${
                                isInCart
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "bg-[#0284c7] hover:bg-[#0369a1] text-white"
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
                    type="button"
                    onClick={handleAddAllUpsells}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 text-gray-700 hover:text-gray-900 py-2 rounded-xl text-[10px] font-bold transition-all mt-1"
                  >
                    ⚡ Add all to cart — $112.94 <span className="text-gray-400 line-through font-medium">$141.94</span>
                  </button>
                </div>
              </div>

              {/* Secure note */}
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
