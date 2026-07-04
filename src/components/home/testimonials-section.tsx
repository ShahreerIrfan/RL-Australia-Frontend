"use client"

import React from "react"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Dr. M. Chen",
        role: "Research Scientist, Sydney",
        text: "Purity levels matched our independent HPLC analysis perfectly. RL Australia is now our primary supplier.",
        rating: 5,
    },
    {
        name: "James W.",
        role: "PhD Candidate, Melbourne",
        text: "Ordered Monday afternoon, received Wednesday morning. Packaging is professional and temperature-controlled.",
        rating: 5,
    },
    {
        name: "Sarah T.",
        role: "Lab Manager, Brisbane",
        text: "The only Australian supplier with consistent batch-to-batch quality and fully transparent documentation.",
        rating: 5,
    },
]

export default function TestimonialsSection() {
    return (
        <section className="py-10 sm:py-14 lg:py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
                    What Researchers Say
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
                            <div className="flex items-center gap-0.5 mb-3">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                            <div>
                                <span className="block text-sm font-semibold text-gray-900">{t.name}</span>
                                <span className="block text-xs text-gray-400">{t.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
