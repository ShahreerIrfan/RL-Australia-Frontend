"use client"

import React, { useState } from "react"
import { Check } from "lucide-react"

export default function FrequentlyBoughtTogether() {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const handleQuickAdd = (itemId: string) => {
    setAddedItems((prev) => ({ ...prev, [itemId]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [itemId]: false }))
    }, 2000)
  }

  return (
    <div className="bg-white border border-gray-200/85 rounded-2xl p-5 shadow-md">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Frequently Bought Together</h4>
      <div className="space-y-2.5">
        {/* Syringes add-on */}
        <div className="flex items-center justify-between gap-3 bg-gray-50/50 border border-gray-100 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border border-gray-150 rounded-lg flex items-center justify-center font-bold text-[10px] text-gray-500 flex-shrink-0">
              1ml
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800 block leading-tight">Sterile Insulin Syringes (Pack of 10)</span>
              <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">$14.95</span>
            </div>
          </div>
          <button
            onClick={() => handleQuickAdd("syringes")}
            className={`font-bold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all flex-shrink-0 ${
              addedItems["syringes"]
                ? "bg-emerald-600 text-white"
                : "bg-gray-900 hover:bg-emerald-600 text-white"
            }`}
          >
            {addedItems["syringes"] ? <Check className="w-3.5 h-3.5" /> : "Add"}
          </button>
        </div>

        {/* Sterile water add-on */}
        <div className="flex items-center justify-between gap-3 bg-gray-50/50 border border-gray-100 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border border-gray-150 rounded-lg flex items-center justify-center font-bold text-[10px] text-gray-500 flex-shrink-0">
              10ml
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800 block leading-tight">Bacteriostatic Sterile Water (10ml)</span>
              <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">$9.95</span>
            </div>
          </div>
          <button
            onClick={() => handleQuickAdd("water")}
            className={`font-bold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all flex-shrink-0 ${
              addedItems["water"]
                ? "bg-emerald-600 text-white"
                : "bg-gray-900 hover:bg-emerald-600 text-white"
            }`}
          >
            {addedItems["water"] ? <Check className="w-3.5 h-3.5" /> : "Add"}
          </button>
        </div>

        {/* Wipes add-on */}
        <div className="flex items-center justify-between gap-3 bg-gray-50/50 border border-gray-100 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border border-gray-150 rounded-lg flex items-center justify-center font-bold text-[10px] text-gray-500 flex-shrink-0">
              Prep
            </div>
            <div>
              <span className="text-xs font-bold text-gray-800 block leading-tight">Alcohol Prep Wipes (Box of 100)</span>
              <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">$6.50</span>
            </div>
          </div>
          <button
            onClick={() => handleQuickAdd("wipes")}
            className={`font-bold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all flex-shrink-0 ${
              addedItems["wipes"]
                ? "bg-emerald-600 text-white"
                : "bg-gray-900 hover:bg-emerald-600 text-white"
            }`}
          >
            {addedItems["wipes"] ? <Check className="w-3.5 h-3.5" /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}
