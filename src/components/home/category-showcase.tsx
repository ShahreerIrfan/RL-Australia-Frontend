"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
    {
        title: "Recovery & Healing",
        count: 8,
        image: "/assets/products/asset 6.png",
        href: "/categories/recovery",
        color: "bg-rose-50 border-rose-100",
    },
    {
        title: "Muscle Growth",
        count: 7,
        image: "/assets/products/asset 8.png",
        href: "/categories/muscle-growth",
        color: "bg-blue-50 border-blue-100",
    },
    {
        title: "Anti-Aging",
        count: 6,
        image: "/assets/products/asset 10.png",
        href: "/categories/anti-aging",
        color: "bg-teal-50 border-teal-100",
    },
    {
        title: "Cognitive",
        count: 5,
        image: "/assets/products/asset 9.png",
        href: "/categories/cognitive",
        color: "bg-violet-50 border-violet-100",
    },
    {
        title: "Fat Loss",
        count: 4,
        image: "/assets/products/asset 13.png",
        href: "/categories/fat-loss",
        color: "bg-amber-50 border-amber-100",
    },
    {
        title: "Bundles",
        count: 3,
        image: "/assets/products/asset 7.png",
        href: "/categories/stacks",
        color: "bg-cyan-50 border-cyan-100",
    },
]

export default function CategoryShowcase() {
    return (
        <section className="py-10 sm:py-14 lg:py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className={`group block rounded-xl border p-4 text-center hover:shadow-md transition-all duration-200 ${cat.color}`}
                        >
                            <div className="flex items-center justify-center h-16 sm:h-20 mb-3">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5">{cat.title}</h3>
                            <p className="text-[10px] sm:text-xs text-gray-400">{cat.count} products</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
