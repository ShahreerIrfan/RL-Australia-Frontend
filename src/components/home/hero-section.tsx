"use client"

import React from "react"
import Link from "next/link"

export default function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden">
            {/* Background image — peptide vials */}
            <div className="absolute inset-0">
                <img
                    src="/assets/hero-background.png"
                    alt=""
                    className="w-full h-full object-cover"
                />
                {/* Black overlay */}
                <div className="absolute inset-0 bg-black/60" />
                {/* Color tint overlay #67B7D4 to #006E96 */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#006E96]/40 to-[#67B7D4]/20" />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-28">
                <div className="max-w-lg">
                    <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-white leading-snug mb-4">
                        Premium Research Peptides
                        <br />
                        <span className="text-sky-200">Delivered to Your Lab</span>
                    </h1>

                    <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-6 max-w-md">
                        Independently-verified peptides for laboratory research. Every lot ships
                        with its own Certificate of Analysis. Australian owned and operated.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/store"
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            Browse Catalog →
                        </Link>
                        <Link
                            href="/research"
                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-sm transition-colors"
                        >
                            View COA Library
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
