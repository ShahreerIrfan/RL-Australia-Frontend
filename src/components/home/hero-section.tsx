"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, CreditCard, ShieldCheck, Truck, Headphones } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[220px] sm:min-h-[440px] md:min-h-[520px] flex items-center bg-gray-950">
      {/* Background image overlay */}
      <div className="absolute inset-0 select-none opacity-40">
        <img
          src="/assets/hero-background.png"
          alt=""
          className="w-full h-full object-cover object-[80%_center] md:object-right"
        />
      </div>
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent" />

      {/* Content wrapper */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left - Content */}
          <div className="lg:col-span-6 text-left">
            <h1 className="text-xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-3 sm:mb-5">
              Lab Tested Peptides
              <br />
              in Australia You Can <span className="bg-gradient-to-r from-sky-400 via-amber-300 to-[#c5a059] bg-clip-text text-transparent underline decoration-[#c5a059] decoration-wavy decoration-3">TRUST</span>
            </h1>

            <p className="text-xs sm:text-xl text-white/90 leading-relaxed mb-6 sm:mb-10 max-w-lg hidden sm:block">
              Not sure where to start? Let us simplify the process for you, and help you find the perfect products for your goals.
            </p>

            <div className="flex flex-wrap gap-2.5 sm:gap-4">
              {/* Primary CTA - Build Your Stack */}
              <Link
                href="/stack-builder"
                className="inline-flex items-center gap-1.5 sm:gap-2.5 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-xs sm:text-base font-extrabold transition-all shadow-lg shadow-sky-600/25 uppercase tracking-wider"
              >
                Build Your Stack
                <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </Link>
              {/* Secondary CTA - Browse Catalog */}
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 sm:gap-2.5 bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/25 text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-full text-xs sm:text-base font-bold backdrop-blur-sm transition-all uppercase tracking-wider"
              >
                Browse Catalog
              </Link>
            </div>

            {/* Quick trust signals */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 text-[10px] sm:text-sm text-white/90 mt-8 sm:mt-10 border-t border-white/10 pt-6">
              <span className="flex items-center gap-1.5 sm:gap-2 font-semibold min-w-0 break-words leading-tight">
                <CreditCard className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                Pay Securely via Card
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2 font-semibold min-w-0 break-words leading-tight">
                <ShieldCheck className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                Purity Tested &amp; COAs
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2 font-semibold min-w-0 break-words leading-tight">
                <Truck className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                Same-Day Dispatch (Before 12pm)
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2 font-semibold min-w-0 break-words leading-tight">
                <Headphones className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                24/7 Customer Support
              </span>
            </div>
          </div>

          {/* Right - Nootropics Depot Multi-image Grid Collage */}
          <div className="lg:col-span-6 hidden lg:block relative h-[420px]">
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
