"use client"

import { updateLineItem, deleteLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@components/common/components/localized-client-link"
import { useState } from "react"
import { X, Minus, Plus } from "lucide-react"
import Spinner from "@components/common/icons/spinner"
import { convertToLocale } from "@lib/util/money"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const changeQuantity = async (quantity: number) => {
    if (quantity <= 0) {
      handleDelete()
      return
    }
    setUpdating(true)
    await updateLineItem({
      lineId: item.id,
      quantity,
    }).finally(() => {
      setUpdating(false)
    })
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteLineItem(item.id).finally(() => {
      setDeleting(false)
    })
  }

  const unitPrice = item.unit_price || 0
  const totalPrice = unitPrice * item.quantity

  return (
    <div className={`relative bg-white rounded-2xl border border-gray-150 p-4 sm:p-5 shadow-xs transition-opacity duration-200 ${updating || deleting ? "opacity-60" : "opacity-100"}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Product Image and Details */}
        <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
          <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-center">
            <img
              src={item.thumbnail || "/assets/peptide-vial.png"}
              alt={item.product_title || item.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/assets/peptide-vial.png" }}
            />
          </LocalizedClientLink>
          <div className="min-w-0">
            <LocalizedClientLink href={`/products/${item.product_handle}`} className="text-sm sm:text-base font-extrabold text-gray-900 hover:text-sky-600 transition-colors block truncate">
              {item.product_title || item.title}
            </LocalizedClientLink>
            {item.variant?.title && item.variant.title !== "Default" && (
              <p className="text-[11px] text-gray-450 font-bold uppercase tracking-wider mt-1">{item.variant.title}</p>
            )}
          </div>
        </div>

        {/* Unit Price */}
        <div className="col-span-1 md:col-span-2 flex md:justify-center items-center gap-2 md:gap-0">
          <span className="text-xs text-gray-400 font-bold md:hidden">Price:</span>
          <span className="text-sm font-bold text-[#c5a059]">
            {convertToLocale({ amount: unitPrice, currency_code: currencyCode })}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="col-span-1 md:col-span-2 flex md:justify-center items-center gap-2 md:gap-0">
          <span className="text-xs text-gray-400 font-bold md:hidden">Qty:</span>
          <div className="flex items-center border border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden">
            <button
              onClick={() => changeQuantity(item.quantity - 1)}
              disabled={updating || deleting}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-800 border-x border-gray-200">
              {updating ? <Spinner className="w-3.5 h-3.5 animate-spin" /> : item.quantity}
            </span>
            <button
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={updating || deleting}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Total Price & Delete Button */}
        <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center gap-3">
          <span className="text-xs text-gray-400 font-bold md:hidden">Total:</span>
          <div className="flex items-center gap-3">
            <span className="text-sm sm:text-base font-black text-gray-900">
              {convertToLocale({ amount: totalPrice, currency_code: currencyCode })}
            </span>
            <button
              onClick={handleDelete}
              disabled={updating || deleting}
              className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-300 hover:text-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
