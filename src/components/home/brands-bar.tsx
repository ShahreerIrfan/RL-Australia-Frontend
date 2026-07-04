"use client"

import React from "react"

export default function BrandsBar() {
    return (
        <section className="border-b border-gray-100 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 text-xs sm:text-sm text-gray-400 font-medium">
                    <span>✓ TGA Compliant</span>
                    <span className="hidden sm:inline text-gray-200">|</span>
                    <span>✓ GMP Certified</span>
                    <span className="hidden sm:inline text-gray-200">|</span>
                    <span>✓ HPLC Tested</span>
                    <span className="hidden sm:inline text-gray-200">|</span>
                    <span>✓ Mass Spec Verified</span>
                    <span className="hidden sm:inline text-gray-200">|</span>
                    <span>✓ Australian Owned</span>
                </div>
            </div>
        </section>
    )
}
