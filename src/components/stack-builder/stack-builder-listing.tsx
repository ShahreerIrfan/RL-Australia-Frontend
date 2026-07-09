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
              const href =
                source === "api"
                  ? `/stack-builder/${option.id}`
                  : `/stack-builder/${option.id}`

              return (
                <Link
                  key={option.id}
                  href={href}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-sky-600 transition-colors" />
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-sky-700 transition-colors">
                    {option.goal_name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {option.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">
                      {option.products.length} product
                      {option.products.length !== 1 ? "s" : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:text-sky-700 transition-colors">
                      View Stack
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
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
