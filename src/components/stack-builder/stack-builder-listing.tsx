"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Heart, Brain, Zap, Dumbbell, Target, Shield, Moon,
  Sparkles, Flame, Smile, Award, Activity, AlertCircle,
  Hourglass, Loader2, Package, ArrowRight
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {options.map((option) => {
              const Icon = iconMap[option.icon] || Heart

              return (
                <Link
                  key={option.id}
                  href={`/stack-builder/${option.id}`}
                  className="group flex flex-col items-center justify-between bg-white rounded-3xl border-2 border-[#02a5e9] p-6 shadow-sm hover:shadow-[0_20px_45px_rgba(2,165,233,0.15)] hover:-translate-y-1.5 transition-all duration-300 text-center min-h-[220px] relative overflow-hidden"
                >
                  {/* Subtle hover background glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-50/10 via-white to-white group-hover:from-sky-50/30 transition-all duration-300 pointer-events-none" />

                  {/* Icon */}
                  <div className="relative w-14 h-14 rounded-2xl bg-[#02a5e9] border-2 border-[#02a5e9] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 text-white stroke-[2]" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 flex flex-col items-center justify-center my-2">
                    <h3 className="relative text-xs sm:text-sm font-black text-[#02a5e9] group-hover:text-sky-700 uppercase tracking-wider leading-tight transition-colors duration-300">
                      {option.goal_name}
                    </h3>

                    {option.description && (
                      <p className="relative text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed max-w-[180px]">
                        {option.description}
                      </p>
                    )}
                  </div>

                  {/* Interactive Button */}
                  <div className="w-full py-2.5 bg-[#02a5e9] text-white text-[10px] font-bold rounded-xl group-hover:bg-sky-600 flex items-center justify-center gap-1.5 transition-all duration-300 border border-[#02a5e9] uppercase tracking-wider select-none">
                    Select Stack <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={3} />
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
