"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Filter, Grid, SlidersHorizontal } from "lucide-react"
import SkeletonProductGrid from "@components/skeletons/templates/skeleton-product-grid"

interface Category {
  id: string
  name: string
  handle: string
  description?: string
}

interface StoreClientPageProps {
  categories: Category[]
  activeCategoryTitle: string
  activeCategoryHandle?: string
  countryCode: string
  sortBy?: string
  children: React.ReactNode
}

export default function StoreClientPage({
  categories,
  activeCategoryTitle,
  activeCategoryHandle,
  countryCode,
  sortBy,
  children
}: StoreClientPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [localLoading, setLocalLoading] = useState(false)

  // Turn off local loading indicator when search params or pathname updates
  useEffect(() => {
    setLocalLoading(false)
  }, [pathname, searchParams])

  const handleCategoryClick = (href: string) => {
    setLocalLoading(true)
    startTransition(() => {
      router.push(href)
    })
  }

  const isLoading = isPending || localLoading

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none" data-testid="category-container">
      
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-10 mb-12 shadow-xl border border-emerald-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(4,120,87,0.15),transparent_50%)]" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl" />
        
        <div className="relative z-10 max-w-2xl text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest mb-4">
            <SlidersHorizontal className="w-3 h-3" /> Peptide Research Shop
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {activeCategoryTitle}
          </h1>
          <p className="text-sm font-semibold text-emerald-200/70 mt-2 max-w-xl">
            Explore our curated selection of high-purity, premium grade research peptides, nootropics and cellular compounds.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar: Categories Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-150 rounded-2xl p-6 shadow-sm select-none text-left">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider block">
              Categories
            </span>
            <Filter className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="flex flex-col gap-2">
            
            {/* All Products link */}
            <button
              onClick={() => handleCategoryClick(`/${countryCode}/store${sortBy ? `?sortBy=${sortBy}` : ""}`)}
              className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all duration-300 text-xs sm:text-sm font-extrabold w-full text-left ${
                !activeCategoryHandle || activeCategoryHandle === "all"
                  ? "bg-[#047857] border-[#047857] text-white font-black shadow-md shadow-emerald-700/10"
                  : "bg-white border-gray-100 text-gray-600 hover:bg-emerald-50/20 hover:text-[#047857] hover:border-emerald-100/50"
              }`}
            >
              <span>All Products</span>
              {(!activeCategoryHandle || activeCategoryHandle === "all") ? (
                <ChevronRight className="w-4 h-4 text-emerald-200" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>

            {/* List of categories */}
            {categories.map((c) => {
              const isActive = activeCategoryHandle?.toLowerCase() === c.handle?.toLowerCase()
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(`/${countryCode}/store?category=${c.handle}${sortBy ? `&sortBy=${sortBy}` : ""}`)}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all duration-300 text-xs sm:text-sm font-extrabold w-full text-left ${
                    isActive
                      ? "bg-[#047857] border-[#047857] text-white font-black shadow-md shadow-emerald-700/10"
                      : "bg-white border-gray-100 text-gray-600 hover:bg-emerald-50/20 hover:text-[#047857] hover:border-emerald-100/50"
                  }`}
                >
                  <span>{c.name}</span>
                  {isActive ? (
                    <ChevronRight className="w-4 h-4 text-emerald-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300 opacity-0" />
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        {/* Right Content Column: Products Grid */}
        <main className="flex-1 w-full text-left">
          
          {/* Skeleton Load or Active Children Grid */}
          {isLoading ? (
            <div className="animate-pulse">
              <SkeletonProductGrid />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
