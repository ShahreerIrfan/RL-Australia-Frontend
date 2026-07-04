"use client"

import React from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Michael R.",
    text: "The stack builder recommended exactly what I needed for recovery. BPC-157 and TB-500 together have been incredible.",
    rating: 5,
    verified: true,
  },
  {
    name: "Sarah T.",
    text: "Finally a site that carries peptides AND nootropics together. Quality is top-notch and shipping was fast.",
    rating: 5,
    verified: true,
  },
  {
    name: "James K.",
    text: "Love the transparency — COA available for every single product. Prices are fair and the checkout upsells actually make sense.",
    rating: 5,
    verified: true,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-500">
            Real reviews from verified buyers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {t.name}
                </span>
                {t.verified && (
                  <span className="text-[10px] sm:text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
