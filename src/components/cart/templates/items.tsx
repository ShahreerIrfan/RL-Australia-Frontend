"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { deleteLineItem } from "@lib/data/cart"
import Item from "@components/cart/components/item"
import { Trash2 } from "lucide-react"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items || []
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = async () => {
    if (items.length === 0) return
    setIsClearing(true)
    try {
      await Promise.all(items.map((item) => deleteLineItem(item.id)))
    } catch (err) {
      console.error("Failed to clear cart:", err)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Header labels */}
      <div className="grid grid-cols-12 gap-4 px-5 text-xs font-black text-gray-400 uppercase tracking-wider select-none hidden md:grid">
        <div className="col-span-6">Product</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {/* Item list */}
      <div className="space-y-4">
        {items
          .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
          .map((item) => (
            <Item
              key={item.id}
              item={item}
              currencyCode={cart?.currency_code || "aud"}
            />
          ))}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end mt-2 select-none">
        <button
          onClick={handleClearCart}
          disabled={isClearing || items.length === 0}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-rose-600 disabled:opacity-50 transition-colors p-2 rounded-lg hover:bg-gray-50"
        >
          <Trash2 className="w-4 h-4" />
          {isClearing ? "Clearing..." : "Clear Cart"}
        </button>
      </div>
    </div>
  )
}

export default ItemsTemplate
