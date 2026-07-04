"use client"

import React from "react"
import Link from "next/link"

export default function PromoBanner() {
    return (
        <section className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 sm:px-8 py-5 sm:py-6">
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <p className="text-emerald-100 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5">Limited Time</p>
                            <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">20% Off Your First Order</h3>
                            <p className="text-xs sm:text-sm text-white/80">
                                Use code <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white font-semibold">WELCOME20</span> at checkout
                            </p>
                        </div>
                        <Link href="/store" className="bg-white text-emerald-700 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-50 transition-colors shadow-sm flex-shrink-0">
                            Shop Now →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
