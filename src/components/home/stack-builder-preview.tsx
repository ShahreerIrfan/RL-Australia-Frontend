"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Heart, Brain, Zap, Dumbbell, Target, ShieldAlert, Sparkles, Shield, 
  Hourglass, Flame, Smile, Award, Activity, Moon, AlertCircle, ArrowRight
} from "lucide-react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Brain, Zap, Dumbbell, Target, ShieldAlert, Sparkles, Shield, 
  Hourglass, Flame, Smile, Award, Activity, Moon, AlertCircle
}

interface Goal {
  id: string
  icon: string
  goal_name: string
  description?: string
}

export default function StackBuilderPreview() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGoals() {
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
            setGoals(data.recommendations)
          }
        }
      } catch (e) {
        console.error("Failed to fetch goals:", e)
      }
      setLoading(false)
    }
    fetchGoals()
  }, [])

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50/50 border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Interactive Stack Finder
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight uppercase">
            Find Your Perfect Stack
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
            Not sure where to start? Take our quick quiz to match with stacks tailored to your goals.
          </p>
          <div className="mt-8">
            <Link
              href="/stack-builder"
              className="inline-flex items-center bg-sky-600 hover:bg-sky-700 active:scale-[0.98] text-white font-extrabold text-base px-12 py-4.5 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-sky-600/30 border-b-4 border-sky-850"
            >
              Take The Quiz!
            </Link>
          </div>
        </div>

        {/* Steps Flow (Step 1 & Step 2) */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto mb-16">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-t border-r border-b border-gray-250/70 border-l-4 border-l-sky-500 shadow-md hover:shadow-lg transition-shadow text-left">
            <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wider mb-2">
              <span className="text-sky-600">Step 1.</span> Choose Your Goal
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
              Start by selecting your wellness goal or main area of focus below to view recommended combinations.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-t border-r border-b border-gray-250/70 border-l-4 border-l-[#c5a059] shadow-md hover:shadow-lg transition-shadow text-left">
            <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wider mb-2">
              <span className="text-[#c5a059]">Step 2.</span> Personalize Stack
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
              Filter by specific benefits, dosage options, delivery method, or dietary preferences.
            </p>
          </div>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 max-w-7xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl border-2 border-slate-100 p-3.5 sm:p-7 min-h-[110px] sm:min-h-[160px] flex flex-col items-center justify-center">
                <div className="w-11 h-11 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl mb-3 sm:mb-4"></div>
                <div className="h-3 w-16 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 max-w-7xl mx-auto">
            {goals.map((goal, index) => {
              const Icon = iconMap[goal.icon] || Heart
              const isEven = index % 2 === 0
              const hoverBorderClass = isEven ? "hover:border-sky-500" : "hover:border-[#c5a059]"
              const hoverIconBgClass = isEven ? "group-hover:bg-sky-600 group-hover:border-sky-600" : "group-hover:bg-[#c5a059] group-hover:border-[#c5a059]"
              const hoverTextClass = isEven ? "group-hover:text-sky-600" : "group-hover:text-[#c5a059]"

              return (
                <Link
                  key={goal.id}
                  href={`/stack-builder/${goal.id}`}
                  className={`group flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-slate-200 p-3.5 sm:p-7 shadow-sm hover:shadow-xl ${hoverBorderClass} hover:-translate-y-1.5 transition-all duration-300 text-center relative overflow-hidden min-h-[110px] sm:min-h-[160px]`}
                >
                  {/* Background soft glow outline on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-50/10 to-amber-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Circular Icon Container */}
                  <div className={`w-11 h-11 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-white ${hoverIconBgClass} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm mb-3 sm:mb-4 flex-shrink-0`}>
                    <Icon className="w-5.5 h-5.5 sm:w-8 sm:h-8 stroke-[1.75]" />
                  </div>

                  {/* Responsive Label */}
                  <span className={`text-[10px] sm:text-xs md:text-sm font-black text-gray-800 ${hoverTextClass} transition-colors uppercase tracking-wider leading-tight break-words max-w-full px-1`}>
                    {goal.goal_name}
                  </span>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
