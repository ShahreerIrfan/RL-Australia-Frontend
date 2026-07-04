"use client"

import React from "react"
import Link from "next/link"
import { Truck, ArrowRight } from "lucide-react"

export default function ShippingBanner() {
  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl px-5 sm:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  Free Shipping on Orders Over $200
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Build a stack and hit the threshold easily — most stacks exceed $350
                </p>
              </div>
            </div>
            <Link
              href="/stack-builder"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
            >
              Start a Stack
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
