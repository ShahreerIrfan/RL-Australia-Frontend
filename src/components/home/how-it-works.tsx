"use client"

import React from "react"

const steps = [
    { num: "1", title: "Browse", desc: "Explore our catalog of 50+ research peptides" },
    { num: "2", title: "Verify", desc: "Check COA documentation and purity data" },
    { num: "3", title: "Order", desc: "Secure checkout with encrypted payments" },
    { num: "4", title: "Receive", desc: "Discreet delivery within 24-48 hours" },
]

export default function HowItWorks() {
    return (
        <section className="py-10 sm:py-14 lg:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
                    How It Works
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {steps.map((step, i) => (
                        <div key={i} className="text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-teal-50 text-teal-600 font-bold text-sm sm:text-base flex items-center justify-center mx-auto mb-3">
                                {step.num}
                            </div>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{step.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
