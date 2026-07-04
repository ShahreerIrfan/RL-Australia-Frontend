"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/hero-background.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Subtle color gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-medium text-white/80">
              Peptides · Nootropics · Supplements · Functional Foods
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Your All-in-One
            <br />
            <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Performance Stack
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
            Premium peptides, nootropics, and supplements — all under one roof.
            Tell us your goal and we&apos;ll build the perfect stack for you.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Primary CTA - Stack Builder */}
            <Link
              href="/stack-builder"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Build Your Stack
              <ArrowRight className="w-4 h-4" />
            </Link>
            {/* Secondary CTA - Browse Catalog */}
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm transition-colors"
            >
              Browse Full Catalog
            </Link>
          </div>

          {/* Quick trust signals */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-10 text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Third-Party Lab Tested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Free Shipping Over $200
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              COA With Every Product
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Fast Australia-Wide Delivery
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
