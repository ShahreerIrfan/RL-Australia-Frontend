"use client"

import React from "react"
import Link from "next/link"
import { FlaskConical, Brain, Pill, Activity, ShoppingBag, Layers } from "lucide-react"

const categories = [
  {
    title: "Peptides",
    description: "Research-grade peptides with COA",
    icon: FlaskConical,
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
    icon: Activity,
    href: "/store?category=gummies",
    bgClass: "bg-amber-50 text-amber-600",
  },
  {
    title: "Add-ons & Accessories",
    description: "Low-cost essentials",
    icon: ShoppingBag,
    href: "/store?category=add-ons",
    bgClass: "bg-rose-50 text-rose-600",
  },
  {
    title: "Stacks & Bundles",
    description: "Curated goal-based combinations",
    icon: Layers,
    href: "/store?category=stacks",
    bgClass: "bg-indigo-50 text-indigo-650",
  },
]

export default function CategoryShowcase() {
  return (
    <section className="py-16 sm:py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3 uppercase tracking-tight">
            Shop by Category
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Everything you need for recovery, performance, and longevity — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group block bg-white rounded-2xl border border-gray-200/80 p-6 text-center shadow-md hover:shadow-lg hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 rounded-xl ${cat.bgClass} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-800 mb-1 group-hover:text-sky-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-snug">
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
