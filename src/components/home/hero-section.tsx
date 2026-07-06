"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[440px] sm:min-h-[500px] md:min-h-[580px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 select-none">
        <img
          src="/assets/hero-background.png"
          alt=""
          className="w-full h-full object-cover object-[80%_center] md:object-right"
        />
        {/* Dark overlay for readability (darker on mobile since there is no container card) */}
        <div className="absolute inset-0 bg-black/65 md:bg-black/45" />
        {/* Subtle color gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/40 to-transparent hidden md:block" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left - Content */}
          <div className="lg:col-span-6 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Lab Tested Supplements
              <br />
              You Can <span className="bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent underline decoration-teal-400 decoration-wavy decoration-3">TRUST</span>
            </h1>

            <p className="text-sm sm:text-lg text-white/85 leading-relaxed mb-8 max-w-lg">
              Not sure where to start? Let us simplify the process for you, and help you find the perfect products for your goals.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Primary CTA - Take the Quiz */}
              <Link
                href="/stack-builder"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 active:scale-[0.98] text-white px-7 py-3.5 rounded-full text-sm font-extrabold transition-all shadow-lg shadow-teal-500/25 uppercase tracking-wider"
              >
                Take the Quiz!
                <ArrowRight className="w-4 h-4" />
              </Link>
              {/* Secondary CTA - Browse Catalog */}
              <Link
                href="/store"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/25 text-white px-7 py-3.5 rounded-full text-sm font-bold backdrop-blur-sm transition-all uppercase tracking-wider"
              >
                Browse Catalog
              </Link>
            </div>

            {/* Quick trust signals */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs text-white/75 mt-10 border-t border-white/10 pt-6">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Third-Party Lab Tested
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Free Shipping Over $200
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                COA With Every Product
              </span>
            </div>
          </div>

          {/* Right - Nootropics Depot Multi-image Grid Collage */}
          <div className="lg:col-span-6 hidden lg:block relative h-[500px]">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-3 p-4">
              {/* Card 1: Vials Shelf (top-left) */}
              <div className="col-span-5 row-span-7 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <img
                  src="/Reference-Site-Asset/asset 16.png"
                  alt="Peptides Lab"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 2: Hand holding dropper (top-right) */}
              <div className="col-span-4 row-span-5 col-start-6 row-start-2 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <img
                  src="/assets/asset 123.jpeg"
                  alt="Dropper supplement"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 3: Lab scientist (bottom-left) */}
              <div className="col-span-3 row-span-5 col-start-1 row-start-8 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <img
                  src="/assets/asset 121.jpeg"
                  alt="Scientist"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 4: Dropper Bottle (bottom-middle) */}
              <div className="col-span-4 row-span-6 col-start-5 row-start-7 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <img
                  src="/assets/asset 31.webp"
                  alt="Supplement Vial"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 5: Plant extracts / Capsules (bottom-right) */}
              <div className="col-span-4 row-span-5 col-start-9 row-start-6 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <img
                  src="/assets/asset 124.jpeg"
                  alt="Nootropics capsules"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
