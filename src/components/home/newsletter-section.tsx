"use client"

import React from "react"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function NewsletterSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Newsletter signup */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl px-6 sm:px-8 py-7 sm:py-9">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5">
              Stay in the Loop
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mb-5">
              New products, exclusive discounts, and research updates. No spam.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all placeholder:text-white/40"
              />
              <button className="bg-white text-gray-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-white/40 mt-3">
              Unsubscribe anytime. We respect your inbox.
            </p>
          </div>

          {/* Guides CTA */}
          <div className="bg-gradient-to-br from-sky-50 to-purple-50 border border-sky-100 rounded-2xl px-6 sm:px-8 py-7 sm:py-9 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
                Free Guides & Resources
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-5">
                Peptide dosing guides, stacking protocols, and how-to resources
                — free to download.
              </p>
            </div>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors w-fit"
            >
              <BookOpen className="w-4 h-4" />
              Browse Guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
