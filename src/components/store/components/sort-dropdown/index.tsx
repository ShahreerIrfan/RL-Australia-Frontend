"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import React from "react"

export default function SortDropdown({ sortBy }: { sortBy: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", e.target.value)
    router.push(pathname + "?" + params.toString())
  }

  return (
    <div className="flex items-center gap-2 select-none">
      <span className="text-xs sm:text-sm font-bold text-gray-500">Sort by:</span>
      <select
        value={sortBy}
        onChange={onChange}
        className="text-xs sm:text-sm font-extrabold text-gray-700 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none cursor-pointer transition-all shadow-xs"
      >
        <option value="created_at">Newest Arrivals</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
      </select>
    </div>
  )
}
