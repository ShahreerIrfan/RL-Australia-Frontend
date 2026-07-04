"use client"

import React from "react"

export default function NewsletterSection() {
    return (
        <section className="py-8 sm:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl px-5 sm:px-8 py-7 sm:py-9 text-center">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
                        Stay in the Loop
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mb-5 max-w-sm mx-auto">
                        New products, exclusive discounts, and research updates. No spam.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                        />
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3">Join 2,400+ researchers. Unsubscribe anytime.</p>
                </div>
            </div>
        </section>
    )
}
