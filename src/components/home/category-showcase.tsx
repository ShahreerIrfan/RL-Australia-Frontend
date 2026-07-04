"use client"

import React from "react"
import Link from "next/link"
import { Dna, Brain, Pill, Sparkles, Package } from "lucide-react"

const categories = [
  {
    title: "Peptides",
    description: "Research-grade peptides with COA",
    icon: Dna,
    href: "/store?category=peptides",
    bgClass: "bg-sky-50 text-sky-600",
  },
  {
    title: "Nootropics",
    description: "Cognitive performance compounds",
    icon: Brain,
    href: "/store?category=nootropics",
    bgClass: "bg-purple-50 text-purple-600",
  },
  {
    title: "Supplements",
    description: "General health & wellness",
    icon: Pill,
    href: "/store?category=supplements",
    bgClass: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Gummies & Functional Foods",
    description: "Tasty, convenient formats",
    icon: Sparkles,
    href: "/store?category=gummies",
    bgClass: "bg-amber-50 text-amber-600",
  },
  {
    title: "Add-ons & Accessories",
    description: "Low-cost essentials",
    icon: Package,
    href: "/store?category=add-ons",
    bgClass: "bg-rose-50 text-rose-600",
  },
]

export default function CategoryShowcase() {
  return (
    <section className="py-12 sm:py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Everything you need for recovery, performance, and longevity — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group block bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 text-center transition-all duration-300 hover:shadow-md hover:border-emerald-500/20 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${cat.bgClass} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
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
