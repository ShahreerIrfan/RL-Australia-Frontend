"use client"

import React from "react"
import Link from "next/link"
import {
  Shield,
  Truck,
  FileCheck,
  Star,
  Lock,
  RotateCcw,
} from "lucide-react"

const trustElements = [
  {
    icon: FileCheck,
    title: "Certificate of Analysis",
    desc: "Full COA & lab results per product",
  },
  {
    icon: Star,
    title: "Customer Reviews",
    desc: "Verified buyer testimonials",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    desc: "256-bit encrypted payments",
  },
  {
    icon: Truck,
    title: "Free Shipping Over $200",
    desc: "Fast Australia-wide delivery",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Hassle-free return policy",
  },
  {
    icon: Shield,
    title: "Third-Party Tested",
    desc: "Independent lab verification",
  },
]

export default function TrustSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Why Customers Trust Us
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Quality, transparency, and reliability — built into everything we do.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {trustElements.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="text-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA to COA library */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/lab-testing"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full px-5 py-2.5 hover:border-gray-300 transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            View Our Lab Testing & COA Library
          </Link>
        </div>
      </div>
    </section>
  )
}
