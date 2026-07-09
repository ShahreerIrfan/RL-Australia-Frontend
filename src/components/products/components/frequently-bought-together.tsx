"use client"

import React, { useState, useEffect } from "react"
import { Check, Loader2 } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

interface Product {
  id: string
  title: string
  handle: string
  price: number
  description: string
  thumbnail: string
  variants?: any[]
  category?: { id: string; name: string } | null
}

interface FrequentlyBoughtTogetherProps {
  currentProduct: {
    id: string
    handle: string
    category?: {
      id: string
      name: string
    } | null
  }
}

export default function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const [accessories, setAccessories] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!currentProduct) return

    const categoryId = currentProduct.category?.id
    const categoryName = currentProduct.category?.name || ""
    
    // Determine if current product is an accessory itself
    const isAccessoryProduct = categoryName.toLowerCase().includes("accessories") || 
                             ["sterile-insulin-syringes", "bacteriostatic-sterile-water", "alcohol-prep-wipes"].includes(currentProduct.handle)
    
    // If it's a regular product (e.g. peptide/supplement) and belongs to a category, fetch items in that category
    const fetchUrl = (categoryId && !isAccessoryProduct)
      ? `${BACKEND_URL}/store/products?category_id=${categoryId}`
      : `${BACKEND_URL}/store/products`

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        const list = data.products || []
        
        // Filter out current product itself
        let filtered = list.filter((p: any) => p.id !== currentProduct.id)
        
        // If we queried a category but got no recommendations, or if the current product is an accessory, fallback to accessories list
        if (filtered.length === 0 || isAccessoryProduct) {
          fetch(`${BACKEND_URL}/store/products`)
            .then(res => res.json())
            .then(allData => {
              const allList = allData.products || []
              const accList = allList.filter((p: any) => 
                p.category?.name?.toLowerCase().includes("accessories") ||
                ["sterile-insulin-syringes", "bacteriostatic-sterile-water", "alcohol-prep-wipes"].includes(p.handle)
              )
              // Order accessories consistently: syringes, water, wipes
              const ordered = [
                accList.find((p: any) => p.handle === "sterile-insulin-syringes"),
                accList.find((p: any) => p.handle === "bacteriostatic-sterile-water"),
                accList.find((p: any) => p.handle === "alcohol-prep-wipes")
              ].filter(Boolean) as Product[]

              setAccessories(ordered.length > 0 ? ordered : (accList as Product[]))
            })
            .catch(err => console.error("Accessories fallback fetch error:", err))
        } else {
          // Show up to 3 items from the same category
          setAccessories(filtered.slice(0, 3) as Product[])
        }
      })
      .catch(err => console.error("Frequently Bought Together Fetch Error:", err))
      .finally(() => setLoading(false))
  }, [currentProduct])

  const handleQuickAdd = async (productId: string, slug: string) => {
    setAddedItems(prev => ({ ...prev, [slug]: true }))
    try {
      let cartId = typeof window !== "undefined" ? localStorage.getItem("rl_cart_id") : null
      if (!cartId) {
        const createRes = await fetch(`${BACKEND_URL}/store/carts`, { method: "POST" })
        if (createRes.ok) {
          const createData = await createRes.json()
          cartId = createData.cart.id
          if (typeof window !== "undefined") {
            localStorage.setItem("rl_cart_id", cartId!)
          }
        }
      }
      if (cartId) {
        const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variant_id: productId || slug, quantity: 1 })
        })
        if (res.ok) {
          window.dispatchEvent(new Event("cart-updated"))
          window.dispatchEvent(new Event("open-cart-drawer"))
        }
      }
    } catch (err) {
      console.error("Frequently Bought Together Add Error:", err)
    } finally {
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [slug]: false }))
      }, 1500)
    }
  }

  const getLabel = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("syringe")) return "1ml"
    if (t.includes("water")) return "10ml"
    if (t.includes("wipe") || t.includes("alcohol")) return "Prep"
    // Fallback for peptides/supplements: first 3 letters capitalized (e.g. NMN, BPC, GLY)
    return title.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase()
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200/85 rounded-2xl p-6 shadow-md flex items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
        <span className="text-xs font-bold text-gray-500">Loading recommendations...</span>
      </div>
    )
  }

  if (accessories.length === 0) return null

  return (
    <div className="bg-white border border-gray-200/85 rounded-2xl p-5 shadow-md text-left">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Frequently Bought Together</h4>
      <div className="space-y-2.5">
        {accessories.map((item) => {
          const isAdded = !!addedItems[item.handle]
          const variantId = item.variants?.[0]?.id || item.id
          const rawPrice = item.variants?.[0]?.calculated_price?.calculated_amount ?? item.price ?? 0
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 bg-gray-50/50 border border-gray-150 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-gray-150 rounded-lg flex items-center justify-center font-bold text-[10px] text-gray-500 flex-shrink-0">
                  {getLabel(item.title)}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-800 block leading-tight">{item.title}</span>
                  <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">
                    A${Number(rawPrice).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleQuickAdd(variantId, item.handle)}
                disabled={isAdded}
                className={`font-bold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all flex-shrink-0 flex items-center justify-center ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-900 hover:bg-emerald-600 text-white"
                }`}
              >
                {isAdded ? <Check className="w-3.5 h-3.5" /> : "Add"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
