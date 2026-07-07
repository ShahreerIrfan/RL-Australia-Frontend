import React from "react"
import SkeletonProductGrid from "@components/skeletons/templates/skeleton-product-grid"

export default function StoreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
          <div className="h-3 w-20 bg-gray-200 rounded mb-4" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-64 bg-gray-100 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-xl" />
          </div>

          <SkeletonProductGrid numberOfProducts={8} />
        </div>
      </div>
    </div>
  )
}
