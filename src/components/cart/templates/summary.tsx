"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@components/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { Ticket, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const subtotal = cart.subtotal || 0
  const currencyCode = cart.currency_code || "aud"

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-6 shadow-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-900">Order Summary</h2>
        <span className="bg-sky-50 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full border border-sky-100">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Coupons/Promo block */}
      <div className="space-y-2.5">
        <button className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 transition-all">
          <span className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-sky-600" /> Have a promo code?
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Breakdown fields */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal ({totalItems} items)</span>
          <span className="font-extrabold text-gray-900">
            {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Shipping</span>
          <span className="text-xs font-bold text-gray-400 italic">Calculated at checkout</span>
        </div>
      </div>

      {/* Total line */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-base font-black text-gray-900">Total</span>
        <span className="text-xl sm:text-2xl font-black text-gray-900">
          {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-2xl text-sm font-bold transition-colors shadow-lg shadow-sky-600/15 border-b-2 border-sky-850"
        >
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </LocalizedClientLink>

        <LocalizedClientLink
          href="/store"
          className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Continue Shopping
        </LocalizedClientLink>

        <div className="flex items-center justify-center pt-2 border-t border-gray-100 select-none">
          <img src="/paymentIcons.png" alt="Payment Methods" className="h-9 w-auto object-contain" />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Secure Payment</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <Truck className="w-4.5 h-4.5" />
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Free Delivery</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#c5a059]">
            <RotateCcw className="w-4.5 h-4.5" />
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Easy Returns</span>
        </div>
      </div>
    </div>
  )
}

export default Summary
