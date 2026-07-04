"use client"

import React from "react"
import { Shield, Truck, FlaskConical, BadgeCheck, Lock, HeadphonesIcon } from "lucide-react"

const features = [
    { icon: FlaskConical, title: "99%+ Purity", desc: "Every batch HPLC verified" },
    { icon: BadgeCheck, title: "COA Included", desc: "Full docs per order" },
    { icon: Shield, title: "3rd Party Tested", desc: "Independent lab verification" },
    { icon: Truck, title: "Fast Shipping", desc: "Same-day dispatch before 2pm" },
    { icon: Lock, title: "Secure Payments", desc: "256-bit encrypted checkout" },
    { icon: HeadphonesIcon, title: "Expert Support", desc: "Mon-Fri helpful team" },
]

export default function WhyChooseUs() {
    return (
        <section className="py-10 sm:py-14 bg-emerald-50/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-8">
                    Why Choose RL Australia
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                    {features.map((f, i) => {
                        const Icon = f.icon
                        return (
                            <div key={i} className="text-center">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-emerald-100 flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5">{f.title}</h3>
                                <p className="text-[10px] sm:text-xs text-gray-500">{f.desc}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-emerald-100">
                    <div className="text-center">
                        <span className="block text-xl sm:text-2xl font-bold text-emerald-700">5,000+</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">Orders Fulfilled</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl sm:text-2xl font-bold text-emerald-700">99.2%</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">Average Purity</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl sm:text-2xl font-bold text-emerald-700">24hr</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">Dispatch Time</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl sm:text-2xl font-bold text-emerald-700">4.9★</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">Customer Rating</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
