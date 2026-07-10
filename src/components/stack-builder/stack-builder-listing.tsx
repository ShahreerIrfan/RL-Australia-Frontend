"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Heart, Brain, Zap, Dumbbell, Target, Shield, Moon,
  Sparkles, Flame, Smile, Award, Activity, AlertCircle,
  Hourglass, Loader2, ArrowRight, Package,
} from "lucide-react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Brain, Zap, Dumbbell, Target, Shield, Moon,
  Sparkles, Flame, Smile, Award, Activity, AlertCircle, Hourglass,
}

interface QuizOption {
  id: string
  icon: string
  goal_name: string
  description: string
  products: any[]
}

export default function StackBuilderListing() {
  const [options, setOptions] = useState<QuizOption[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<"api" | "static">("static")

  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch(`${BACKEND_URL}/store/recommendations`, {
          headers: {
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
        })
        if (res.ok) {
          const data = await res.json()
          if (data.recommendations && data.recommendations.length > 0) {
            setOptions(data.recommendations)
            setSource("api")
            setLoading(false)
            return
          }
        }
      } catch (e) {
        // Backend unavailable
      }

      // No backend data — show empty state (do NOT use static fallback)
      setOptions([])
      setSource("static")
      setLoading(false)
    }

    fetchOptions()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Find Your Perfect Stack
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Choose a goal below and we&apos;ll show you the best combination of
            products to help you achieve it.
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {options.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No stack options available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {options.map((option) => {
              const Icon = iconMap[option.icon] || Heart
              const href = `/stack-builder/${option.id}`
              const productCount = option.products?.length || 0

              return (
                <Link
                  key={option.id}
                  href={href}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Top gradient accent */}
                  <div className="h-1.5 bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 sm:p-7">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center mb-5 group-hover:from-sky-50 group-hover:to-emerald-50 group-hover:border-sky-100 transition-all duration-300 shadow-sm">
                      <Icon className="w-7 h-7 text-gray-600 group-hover:text-sky-600 transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {option.goal_name}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
                      {option.description || "Explore curated products for this goal."}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {[...Array(Math.min(productCount, 3))].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <Package className="w-3 h-3 text-gray-400" />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          {productCount} product{productCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700 bg-sky-50 group-hover:bg-sky-100 px-3 py-1.5 rounded-full transition-colors">
                        View Stack
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
