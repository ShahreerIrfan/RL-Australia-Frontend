"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Heart, Brain, Zap, Dumbbell, Target, Shield, Moon,
  Sparkles, Flame, Smile, Award, Activity, AlertCircle,
  Hourglass, Loader2, Package,
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
          }
        }
      } catch (e) {
        // Backend unavailable
      }
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
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase mb-3">
            Find Your Perfect Stack
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Choose a goal below and we&apos;ll show you the best combination of products to help you achieve it.
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {options.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No stack options available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {options.map((option) => {
              const Icon = iconMap[option.icon] || Heart

              return (
                <Link
                  key={option.id}
                  href={`/stack-builder/${option.id}`}
                  className="group flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-gray-100 p-4 sm:p-6 lg:p-8 hover:shadow-xl hover:border-sky-200 hover:-translate-y-1 transition-all duration-300 text-center min-h-[130px] sm:min-h-[160px] lg:min-h-[180px] relative overflow-hidden"
                >
                  {/* Subtle hover background glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-50/0 to-sky-50/0 group-hover:from-sky-50/40 group-hover:to-white transition-all duration-300 pointer-events-none" />

                  {/* Icon */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-sky-50 group-hover:border-sky-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-600 group-hover:text-sky-600 transition-colors duration-300 stroke-[1.75]" />
                  </div>

                  {/* Title */}
                  <h3 className="relative text-[10px] sm:text-xs lg:text-sm font-black text-gray-800 group-hover:text-sky-700 uppercase tracking-wider leading-tight transition-colors duration-300">
                    {option.goal_name}
                  </h3>

                  {/* Description - only on larger screens */}
                  {option.description && (
                    <p className="relative hidden sm:block text-[10px] lg:text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed max-w-[140px] lg:max-w-[180px]">
                      {option.description}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
