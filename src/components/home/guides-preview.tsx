"use client"

import React from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, Download } from "lucide-react"

const guides = [
  {
    title: "BPC-157 Dosing Guide",
    description: "Complete guide to BPC-157 reconstitution, dosing, and stacking protocols.",
    category: "Peptide Guide",
  },
  {
    title: "Beginner's Nootropic Stack",
    description: "How to build your first cognitive performance stack safely and effectively.",
    category: "Stack Guide",
  },
  {
    title: "Recovery Peptide Protocol",
    description: "Optimized recovery protocols using BPC-157, TB-500, and KPV together.",
    category: "Protocol",
  },
]

export default function GuidesPreview() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Free Guides &amp; Resources
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-lg">
              Educational peptide and supplement guides — download for free, no
              account required. Build trust and knowledge before you buy.
            </p>
          </div>
          <Link
            href="/resources"
            className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1 flex-shrink-0"
          >
            All Guides <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {guides.map((guide, i) => (
            <Link
              key={i}
              href="/resources"
              className="group bg-white hover:bg-gray-50/50 border border-gray-200/80 rounded-2xl p-5 shadow-md hover:shadow-lg hover:border-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="inline-block text-[10px] sm:text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded mb-3">
                {guide.category}
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 group-hover:text-sky-700 transition-colors">
                {guide.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3">
                {guide.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 group-hover:text-sky-600 transition-colors">
                <Download className="w-3.5 h-3.5" />
                Free Download
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
