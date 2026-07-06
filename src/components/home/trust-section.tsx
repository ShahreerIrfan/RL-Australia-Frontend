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
              <div
                key={i}
                className="bg-white border border-gray-150 rounded-2xl p-4 sm:p-5 text-center shadow-sm hover:shadow-md hover:border-gray-200/80 transition-all duration-300 flex flex-col items-center justify-start"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Wide Banner - MEET OUR THIRD PARTY LABS */}
        <div className="relative mt-12 sm:mt-16 rounded-2xl overflow-hidden h-[300px] flex items-center justify-center text-center shadow-lg border border-gray-100">
          <img
            src="/assets/asset 121.jpeg"
            alt="Third Party Labs"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          
          <div className="relative z-10 px-4 sm:px-6 max-w-2xl">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mb-2">
              Meet Our Third-Party Labs
            </h3>
            <p className="text-sm sm:text-base text-gray-200 mb-6 font-medium">
              Learn how we&apos;re doing more lab testing than anyone else in the industry
            </p>
            <Link
              href="/lab-testing"
              className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-xs sm:text-sm px-8 py-3 rounded-md uppercase tracking-wider transition-colors shadow-sm"
            >
              Explore Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
