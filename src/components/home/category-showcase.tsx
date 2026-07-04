"use client"

import React from "react"
import Link from "next/link"
import { FlaskConical, Brain, Pill, Cookie, Package } from "lucide-react"

const categories = [
  {
    title: "Peptides",
    description: "Research-grade peptides with COA",
    icon: FlaskConical,
    href: "/store?category=peptides",
    color: "bg-sky-50 border-sky-100 hover:border-sky-200",
    iconColor: "text-sky-600",
  },
  {
    title: "Nootropics",
    description: "Cognitive performance compounds",
    icon: Brain,
    href: "/store?category=nootropics",
    color: "bg-purple-50 border-purple-100 hover:border-purple-200",
    iconColor: "text-purple-600",
  },
  {
    title: "Supplements",
    description: "General health & wellness",
    icon: Pill,
    href: "/store?category=supplements",
    color: "bg-emerald-50 border-emerald-100 hover:border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    title: "Gummies & Functional Foods",
    description: "Tasty, convenient formats",
    icon: Cookie,
    href: "/store?category=gummies",
    color: "bg-amber-50 border-amber-100 hover:border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    title: "Add-ons & Accessories",
    description: "Low-cost essentials",
    icon: Package,
    href: "/store?category=add-ons",
    color: "bg-rose-50 border-rose-100 hover:border-rose-200",
    iconColor: "text-rose-600",
  },
]

export default function CategoryShowcase() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Everything you need for recovery, performance, and longevity — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={`group block rounded-xl border p-4 sm:p-5 text-center transition-all duration-200 hover:shadow-md ${cat.color}`}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${cat.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                  {cat.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">
                  {cat.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
