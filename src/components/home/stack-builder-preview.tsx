"use client"

import React from "react"
import Link from "next/link"
import { 
  Heart, Brain, Zap, Dumbbell, Target, ShieldAlert, Sparkles, Shield, 
  Hourglass, Flame, Smile, Award, Activity, Moon, AlertCircle, ArrowRight
} from "lucide-react"

const goals = [
  { icon: Heart, label: "Cardiovascular", slug: "cardiovascular" },
  { icon: Brain, label: "Cognition", slug: "cognition" },
  { icon: Zap, label: "Energy", slug: "energy" },
  { icon: Dumbbell, label: "Fitness", slug: "fitness" },
  { icon: Target, label: "Focus", slug: "focus" },
  { icon: ShieldAlert, label: "Gut Health", slug: "gut-health" },
  { icon: Sparkles, label: "Hormones", slug: "hormones" },
  { icon: Shield, label: "Immune", slug: "immune" },
  { icon: Hourglass, label: "Longevity", slug: "longevity" },
  { icon: Flame, label: "Metabolism", slug: "metabolism" },
  { icon: Smile, label: "Mood", slug: "mood" },
  { icon: Award, label: "Motivation", slug: "motivation" },
  { icon: Activity, label: "Pain", slug: "pain" },
  { icon: Sparkles, label: "Skin Health", slug: "skin-health" },
  { icon: Moon, label: "Sleep", slug: "sleep" },
  { icon: AlertCircle, label: "Stress", slug: "stress" },
]

export default function StackBuilderPreview() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight uppercase">
            Find Your Perfect Supplements
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-2xl mx-auto font-medium">
            Not sure where to start? Take our quick quiz to match with supplements tailored to your goals.
          </p>
          <div className="mt-6">
            <Link
              href="/stack-builder"
              className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base px-10 py-4 rounded-md uppercase tracking-wider transition-colors shadow-md border-b-4 border-sky-800"
            >
              Take The Quiz!
            </Link>
          </div>
        </div>

        {/* Steps Flow (Step 1 & Step 2) */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto mb-12 text-center">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200/80 shadow-md">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-wide mb-2 flex items-center justify-center gap-2">
              <span className="text-[#c5a059]">Step 1.</span> Your Goal
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              Start by selecting your wellness goal or main area of focus below.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200/80 shadow-md">
            <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-wide mb-2 flex items-center justify-center gap-2">
              <span className="text-[#c5a059]">Step 2.</span> Personalize
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              Filter by specific benefits, delivery method, or dietary preferences.
            </p>
          </div>
        </div>

        {/* 16 Goals Grid - 4 Column Layout on Mobile */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-7xl mx-auto">
          {goals.map((goal) => {
            const Icon = goal.icon
            return (
              <Link
                key={goal.slug}
                href={`/stack-builder?goal=${goal.slug}`}
                className="group flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200/80 p-2 sm:p-6 shadow-sm hover:shadow-md hover:border-sky-500/50 transition-all duration-300 text-center"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-gray-700 group-hover:text-[#c5a059] transition-colors mb-2 sm:mb-3">
                  <Icon className="w-5 h-5 sm:w-8 sm:h-8 stroke-[1.5]" />
                </div>
                <span className="text-[10px] sm:text-sm md:text-base font-extrabold text-gray-900 group-hover:text-[#c5a059] transition-colors line-clamp-1">
                  {goal.label}
                </span>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
