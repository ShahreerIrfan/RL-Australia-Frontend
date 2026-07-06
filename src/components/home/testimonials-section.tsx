"use client"

import React from "react"
import Link from "next/link"
import { Star, ShieldCheck, ThumbsUp, Search } from "lucide-react"

const boardMembers = [
  {
    name: "Dr. Lindsey Faucette",
    title: "FAAFP, Doctor of Osteopathic Medicine, Double Board Certified",
    image: "/assets/asset 27.webp",
  },
  {
    name: "Lance Dreher",
    title: "Certified Life Coach, Known As Doctor Fitness, PhD In Nutritional Counseling",
    image: "/assets/asset 28.webp",
  },
  {
    name: "Francisco Chacon",
    title: "PhD In Plant Biology, Senior Research Scientist",
    image: "/assets/asset 29.png",
  },
  {
    name: "Kerry Hughes",
    title: "Author, Ethnobotanist, Herbalist, MSc, RH(AHG), FDN-P",
    image: "/assets/asset 30.webp",
  },
]

const reviews = [
  {
    title: "Love!!!",
    text: "I really love these alot, I've been going through it rough and these truly helped me stabilize.",
    rating: 5,
    author: "Amber G.",
    location: "Tennessee, United States",
    image: "/assets/asset 31.webp",
    product: "Polygala Tenuifolia",
    date: "2 weeks ago",
  },
  {
    title: "Really loved it!",
    text: "I purchased Saffron to help with focus and concentration. Mid March was a lifesaver.",
    rating: 5,
    author: "Yesica B.",
    location: "Colorado, United States",
    image: "/assets/asset 37.webp",
    product: "Ashwagandha KSM-66",
    date: "1 month ago",
  },
  {
    title: "Definitely recommended!",
    text: "I have been using Cognance and Sabroxy from Nootropics Depot in combination. Unbelievable results.",
    rating: 5,
    author: "Michele M.",
    location: "Chiampo, Italy",
    image: "/assets/asset 42.webp",
    product: "BPC-157 5mg",
    date: "3 weeks ago",
  },
  {
    title: "Highly recommended!",
    text: "I have been using Ashwagandha for stress support. Highly potent and works immediately.",
    rating: 5,
    author: "Michele M.",
    location: "Chiampo, Italy",
    image: "/assets/asset 44.webp",
    product: "TB-500 5mg",
    date: "2 months ago",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============ SCIENTIFIC ADVISORY BOARD ============ */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight uppercase">
            Scientific Advisory Board
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-2xl mx-auto font-medium">
            Our independent team of board-certified doctors, PhDs, and botanists review our products and research claims, ensuring exceptional quality, rigor, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {boardMembers.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200/60 p-6 text-center shadow-sm flex flex-col items-center"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[200px]">
                {member.title}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mb-20">
          <Link
            href="/about"
            className="inline-flex items-center bg-[#1d2d3d] hover:bg-gray-800 text-white font-extrabold text-base px-8 py-3.5 rounded-md uppercase tracking-wider transition-colors shadow-sm"
          >
            Meet Our Scientific Advisory Board
          </Link>
        </div>

        {/* ============ CUSTOMER REVIEWS ============ */}
        <div className="border-t border-gray-200 pt-16 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                Reviews
              </h2>
              <div className="flex items-center gap-2.5 mt-1.5">
                <div className="flex text-amber-500 fill-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-base font-bold text-gray-700">
                  4.7 out of 5 stars (8.2K customer reviews)
                </span>
              </div>
            </div>
            <div>
              <button className="bg-[#1d2d3d] hover:bg-gray-850 text-white font-extrabold text-base px-8 py-3.5 rounded-md uppercase tracking-wider transition-colors">
                Write a review
              </button>
            </div>
          </div>

          {/* Search Reviews bar */}
          <div className="relative max-w-md mb-8">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Photo if provided */}
                  {r.image && (
                    <div className="w-full h-44 rounded-md overflow-hidden mb-3.5 bg-gray-50 border border-gray-150">
                      <img
                        src={r.image}
                        alt="Review photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Stars and Date */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-amber-500">
                      {[...Array(r.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {r.date}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-gray-900 mb-1.5 line-clamp-1">
                    {r.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {r.text}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3.5 mt-2">
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                    <span>{r.author}</span>
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {r.location}
                  </div>
                  <div className="mt-2 text-xs text-sky-600 font-bold hover:underline">
                    View product: {r.product}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="inline-flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-base px-8 py-3 rounded-md uppercase tracking-wider transition-colors bg-white">
              Show More
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
