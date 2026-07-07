import React from "react"

export default function ProductDetailLoading() {
  return (
    <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Media & Gallery Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-y-6">
          <div className="block w-full relative bg-gray-50 border border-gray-100 rounded-2xl h-[300px] sm:h-[450px] lg:h-[500px]" />
          {/* Science / Trust Badges Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-gray-100 rounded-2xl p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-250" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Actions / Pricing Skeleton */}
        <div className="lg:col-span-5 flex flex-col gap-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs">
            {/* Title / Description */}
            <div className="space-y-3">
              <div className="h-3 w-20 bg-gray-250 rounded" />
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-250 rounded" />
              <div className="space-y-1">
                <div className="h-3.5 w-full bg-gray-200 rounded" />
                <div className="h-3.5 w-full bg-gray-200 rounded" />
                <div className="h-3.5 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Pricing Tiers Section */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-50 border border-gray-100 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="h-12 w-full bg-sky-600/30 border border-sky-650/10 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
