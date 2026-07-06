import React from "react"
import { Metadata } from "next"
import { BookOpen, FileCheck, ArrowRight, Download, Search, FlaskConical } from "lucide-react"

export const metadata: Metadata = {
  title: "Research & Lab Reports",
  description: "Access our peptide dosing guides, nootropic stacks, R&D publications, and Certificates of Analysis (COA).",
}

const guides = [
  {
    title: "BPC-157 Dosing Guide",
    description: "Complete guide to BPC-157 reconstitution, dosing, and stacking protocols.",
    category: "Peptide Guide",
    fileSize: "1.2 MB"
  },
  {
    title: "Beginner's Nootropic Stack",
    description: "How to build your first cognitive performance stack safely and effectively.",
    category: "Stack Guide",
    fileSize: "850 KB"
  },
  {
    title: "Recovery Peptide Protocol",
    description: "Optimized recovery protocols using BPC-157, TB-500, and KPV together.",
    category: "Protocol Guide",
    fileSize: "1.5 MB"
  },
]

const articles = [
  {
    title: "Niacin vs NMN: Key Similarities, Differences, and Daily Usage Tips",
    date: "August 26, 2025",
    image: "/assets/asset 61.jpeg",
    excerpt: "Explore the biochemistry of cellular energy precursors and how NMN stacks against traditional Niacin for NAD+ restoration."
  },
  {
    title: "Infini-B | A Deep Dive Into B-Vitamins & Their Synergistic Effects",
    date: "May 22, 2023",
    image: "/assets/asset 62.webp",
    excerpt: "Understand how B-vitamin optimization impacts metabolic performance, neurotransmitter synthesis, and longevity."
  },
  {
    title: "Tribulus vs. Tongkat Ali: Which Supplement Is Right for You?",
    date: "August 7, 2025",
    image: "/assets/asset 63.jpeg",
    excerpt: "A comprehensive breakdown of biological actions, hormonal modulation, and strength profiles of standard adaptogens."
  },
  {
    title: "Ashwagandha Benefits | An Ayurvedic Herb for Stress Support",
    date: "September 19, 2021",
    image: "/assets/asset 127.webp",
    excerpt: "Review the clinical science behind standardized KSM-66 extract for reducing cortisol levels and supporting deep sleep cycles."
  },
]

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#1c2229] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <span className="text-sm font-extrabold text-[#00b2a9] uppercase tracking-widest block mb-3">
            RL Research Library
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-5">
            Scientific Reports &amp; Guides
          </h1>
          <p className="text-base sm:text-xl text-gray-300 leading-relaxed max-w-3xl">
            Access our independent laboratory reviews, compound dosing guides, and Certificates of Analysis (COA) batch database.
          </p>
        </div>
      </section>

      {/* COA Batch Lookup */}
      <section className="py-12 bg-gray-50 border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 p-8 sm:p-10 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-lg font-black uppercase tracking-wider mb-1.5 flex items-center gap-2 text-gray-900">
                <FileCheck className="w-5 h-5 text-[#00b2a9]" />
                Certificate of Analysis (COA) Batch Lookup
              </h3>
              <p className="text-sm text-gray-550 font-medium">
                Enter your product batch number (printed on your vial) to retrieve its HPLC purity report.
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md gap-2.5">
              <input
                type="text"
                placeholder="e.g. BPC-2026"
                className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#00b2a9] focus:border-[#00b2a9]"
              />
              <button className="bg-[#1d2d3d] hover:bg-gray-800 text-white font-extrabold text-xs px-6 py-3 rounded uppercase tracking-wider transition-colors">
                Search Batch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
            Downloadable Guides &amp; Protocols
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium">
            Clinical dosing recommendations, stack templates, and reconstitution calculation spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-extrabold text-[#00b2a9] bg-teal-50 px-2 py-1 rounded mb-4 uppercase">
                  {guide.category}
                </span>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {guide.description}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-gray-400 font-medium">PDF ({guide.fileSize})</span>
                <button className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00b2a9] hover:text-[#00938c] uppercase tracking-wider">
                  <Download className="w-4 h-4" />
                  Download Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Articles / Blog */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
              Published Literature &amp; R&amp;D Reports
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium">
              In-depth research on active supplement mechanisms, clinical trials, and compound synergy profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((art, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row group"
              >
                <div className="w-full sm:w-44 h-48 sm:h-auto overflow-hidden bg-gray-100 border-r border-gray-100 flex-shrink-0">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-left flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">
                      {art.date}
                    </span>
                    <h4 className="text-base font-extrabold text-gray-900 leading-snug group-hover:text-[#00b2a9] transition-colors mb-2 line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-550 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button className="text-xs font-extrabold text-[#00b2a9] hover:text-[#00938c] flex items-center gap-1 uppercase tracking-wider">
                      Read Report
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
