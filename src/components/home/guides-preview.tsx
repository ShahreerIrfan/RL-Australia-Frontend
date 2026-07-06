"use client"

import React from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, Download, Music, Radio } from "lucide-react"

const blogPosts = [
  {
    title: "Niacin vs NMN: Key Similarities, Differences, and Daily Usage Tips",
    date: "Posted on 26th Aug 2025",
    image: "/assets/asset 61.jpeg",
  },
  {
    title: "Infini-B | A Deep Dive Into B-Vitamins & Their Synergistic Effects",
    date: "Posted on 22nd May 2023",
    image: "/assets/asset 62.webp",
  },
  {
    title: "Tribulus vs. Tongkat Ali: Which Supplement Is Right for You?",
    date: "Posted on 7th Aug 2025",
    image: "/assets/asset 63.jpeg",
  },
  {
    title: "Ashwagandha Benefits | An Ayurvedic Herb for Stress Support",
    date: "Posted on 19th Sep 2021",
    image: "/assets/asset 127.webp",
  },
]

export default function GuidesPreview() {
  return (
    <div className="bg-white">
      {/* ============ NEED HELP MAKING THE RIGHT CHOICE? (GUIDES GRID) ============ */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-150">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-tight">
            Need Help Making The Right Choice?
          </h2>
          <p className="text-base sm:text-lg text-gray-650 mt-3 max-w-2xl mx-auto font-medium">
            We know choosing the right product can be tough. Our in-depth buying guides break down the features, benefits, and best uses to help you make confident purchases.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Left Large Column - Image Card */}
          <div className="md:col-span-4 relative rounded-xl overflow-hidden min-h-[350px] shadow-md border border-gray-100 flex items-end p-6">
            <img
              src="/assets/asset 123.jpeg"
              alt="Guides"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="relative z-10 text-left">
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                Downloadable Guides
              </h3>
              <p className="text-xs text-gray-250 font-medium mb-4 leading-relaxed">
                Unlock full research details, reconstitution ratios, and dosage guides.
              </p>
              <Link
                href="/resources"
                className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-[11px] px-4 py-2 rounded uppercase tracking-wider transition-colors"
              >
                Browse Guides
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column - Grid of Guide Cards */}
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-6">
            {/* Compare Supplements */}
            <div className="relative rounded-xl overflow-hidden h-[180px] flex items-end p-5 shadow-sm border border-gray-100">
              <img
                src="/assets/asset 124.jpeg"
                alt="Compare Supplements"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-left w-full">
                <h4 className="text-base font-extrabold text-white mb-2 uppercase">
                  Compare Supplements
                </h4>
                <Link
                  href="/resources"
                  className="inline-block bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-[10px] px-3.5 py-1.5 rounded uppercase tracking-wider transition-colors"
                >
                  Compare Now
                </Link>
              </div>
            </div>

            {/* Beginner Recommendations */}
            <div className="relative rounded-xl overflow-hidden h-[180px] flex items-end p-5 shadow-sm border border-gray-100">
              <img
                src="/assets/asset 125.jpeg"
                alt="Beginner Recommendations"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-left w-full">
                <h4 className="text-base font-extrabold text-white mb-2 uppercase">
                  Beginner Recommendations
                </h4>
                <Link
                  href="/resources"
                  className="inline-block bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-[10px] px-3.5 py-1.5 rounded uppercase tracking-wider transition-colors"
                >
                  View Recommendations
                </Link>
              </div>
            </div>

            {/* Stack Recommendations */}
            <div className="relative rounded-xl overflow-hidden h-[180px] flex items-end p-5 shadow-sm border border-gray-100">
              <img
                src="/assets/asset 126.jpeg"
                alt="Stack Recommendations"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-left w-full">
                <h4 className="text-base font-extrabold text-white mb-2 uppercase">
                  Stack Recommendations
                </h4>
                <Link
                  href="/resources"
                  className="inline-block bg-white hover:bg-gray-100 text-gray-900 font-extrabold text-[10px] px-3.5 py-1.5 rounded uppercase tracking-wider transition-colors"
                >
                  See Stacks Recommendations
                </Link>
              </div>
            </div>

            {/* Premium Quality Supplements */}
            <div className="bg-[#1d2d3d] rounded-xl flex flex-col justify-between p-5 shadow-sm border border-gray-800">
              <h4 className="text-base font-extrabold text-white uppercase">
                Premium Quality Supplements
              </h4>
              <div className="mt-4 text-left">
                <Link
                  href="/store"
                  className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded uppercase tracking-wider transition-colors shadow-sm"
                >
                  Explore Quality Supplements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ND INSIDER REWARDS ============ */}
      <section className="py-16 bg-gray-50 border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-gray-200/70 p-8 sm:p-12 rounded-2xl shadow-sm max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
              Unlock More With ND Insider Rewards
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-8 font-medium">
              Earn points every time you shop. Level up for VIP perks, cash back, and exclusive looks into our science and R&D efforts.
            </p>

            {/* Tiers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
              {[
                { name: "Beginner Biohacker", color: "text-gray-400" },
                { name: "Cobalt Member", color: "text-sky-600" },
                { name: "Silver Enthusiast", color: "text-slate-400" },
                { name: "Gold Insider", color: "text-amber-500" },
                { name: "Platinum Elite", color: "text-teal-600" },
              ].map((tier, idx) => (
                <div key={idx} className="flex flex-col items-center p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className={`w-12 h-12 rounded-full border-2 border-current flex items-center justify-center font-black text-lg mb-3 ${tier.color}`}>
                    N
                  </div>
                  <span className="text-sm font-extrabold text-gray-800 leading-snug">
                    {tier.name}
                  </span>
                </div>
              ))}
            </div>

            <button className="bg-[#1d2d3d] hover:bg-gray-850 text-white font-extrabold text-base px-10 py-4 rounded-md uppercase tracking-wider transition-colors shadow-sm">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f0f2f5] rounded-2xl overflow-hidden p-8 sm:p-12 shadow-sm grid md:grid-cols-2 gap-8 items-center border border-gray-200/50">
            {/* Left Column */}
            <div className="text-left">
              <span className="text-sm font-extrabold text-[#c5a059] uppercase tracking-widest block mb-2">
                In Search of Insight Podcast
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                Unlock Deeper Supplement Science
              </h2>
              <p className="text-base text-gray-550 leading-relaxed mb-8 max-w-md font-medium">
                Join our research teams as we dissect the biochemistry, dosing, and synergy profiles of advanced nootropics and peptides.
              </p>

              {/* Player platforms */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="text-xs font-bold text-gray-400 uppercase mr-2">Listen On</span>
                <Radio className="w-5 h-5 text-gray-500 hover:text-sky-600 cursor-pointer transition-colors" />
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-500 hover:text-sky-600 cursor-pointer transition-colors" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <Music className="w-5 h-5 text-gray-500 hover:text-sky-600 cursor-pointer transition-colors" />
              </div>

              <button className="bg-[#1d2d3d] hover:bg-gray-850 text-white font-extrabold text-base px-10 py-4 rounded-md uppercase tracking-wider transition-colors shadow-sm">
                Listen Now
              </button>
            </div>

            {/* Right Column - Image of hosts */}
            <div className="flex justify-center">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                <img
                  src="/assets/asset 128.jpeg"
                  alt="Podcast Hosts"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LEARNING / BLOG ============ */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-tight">
            Learning
          </h2>
          <p className="text-base text-gray-500 mt-3 font-medium">
            Stay up to date with the latest peptide breakthroughs and supplement reviews
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between group">
              <div>
                <div className="w-full h-44 overflow-hidden bg-gray-50 border-b border-gray-150">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-left">
                  <span className="text-[11px] font-bold text-gray-400 block mb-2 uppercase">
                    {post.date}
                  </span>
                  <h4 className="text-base font-extrabold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 text-left">
                <Link
                  href="/resources"
                  className="text-sm font-extrabold text-sky-600 hover:text-sky-700 flex items-center gap-1 uppercase tracking-wider"
                >
                  Read More
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
