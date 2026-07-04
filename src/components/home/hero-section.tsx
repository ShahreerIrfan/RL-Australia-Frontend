"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[480px] sm:min-h-[540px] md:min-h-[580px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 select-none">
        <img
          src="/assets/hero-background.png"
          alt=""
          className="w-full h-full object-cover object-[78%_center] md:object-right"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 md:bg-black/45" />
        {/* Subtle color gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/40 to-transparent hidden md:block" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-20 lg:py-24">
        <div className="max-w-2xl bg-gray-950/65 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none rounded-2xl p-5 sm:p-8 md:p-0 shadow-2xl md:shadow-none">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] sm:text-xs font-semibold text-white/95 tracking-wide">
              Peptides · Nootropics · Supplements · Functional Foods
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Your All-in-One
            <br />
            <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Performance Stack
            </span>
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-white/80 leading-relaxed mb-6 max-w-lg">
            Premium peptides, nootropics, and supplements — all under one roof.
            Tell us your goal and we&apos;ll build the perfect stack for you.
          </p>

          <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
            {/* Primary CTA - Stack Builder */}
            <Link
              href="/stack-builder"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20"
            >
              Build Your Stack
              <ArrowRight className="w-4 h-4" />
            </Link>
            {/* Secondary CTA - Browse Catalog */}
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/25 text-white px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm transition-all"
            >
              Browse Full Catalog
            </Link>
          </div>

          {/* Quick trust signals */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs text-white/75 border-t border-white/10 pt-4 md:border-none md:pt-0">
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
