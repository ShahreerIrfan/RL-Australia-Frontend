"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Target, Zap, Brain, Heart, Shield } from "lucide-react"

const goals = [
  { icon: Heart, label: "Recovery", color: "bg-rose-50 text-rose-600 border-rose-100" },
  { icon: Shield, label: "Anti-Inflammation", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: Brain, label: "Cognitive Performance", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { icon: Zap, label: "Energy & Longevity", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { icon: Target, label: "Muscle Growth", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
]

export default function StackBuilderPreview() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Description */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">
              <Target className="w-3.5 h-3.5" />
              Stack Builder
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Tell Us Your Goal.
              <br />
              We&apos;ll Build Your Stack.
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-6 max-w-md">
              Select your goal and our recommendation engine suggests the
              perfect combination of peptides, nootropics, and supplements.
              Remove anything you don&apos;t want — it&apos;s fully customizable.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 font-bold">
                  1
                </span>
                <p className="text-sm text-gray-600">
                  Choose a goal: recovery, cognition, anti-aging, and more
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 font-bold">
                  2
                </span>
                <p className="text-sm text-gray-600">
                  Get a curated stack recommendation tailored to you
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 font-bold">
                  3
                </span>
                <p className="text-sm text-gray-600">
                  Customize freely — remove or swap any item before checkout
                </p>
              </div>
            </div>

            <Link
              href="/stack-builder"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Start Building
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right - Goal picker preview */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <p className="text-sm font-medium text-gray-700 mb-4">
              What&apos;s your primary goal?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goals.map((goal) => {
                const Icon = goal.icon
                return (
                  <Link
                    key={goal.label}
                    href="/stack-builder"
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 hover:shadow-sm transition-all ${goal.color}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">
                      {goal.label}
                    </span>
                  </Link>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Or{" "}
              <Link
                href="/stack-builder"
                className="text-emerald-600 hover:underline font-medium"
              >
                build a custom stack from scratch
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
