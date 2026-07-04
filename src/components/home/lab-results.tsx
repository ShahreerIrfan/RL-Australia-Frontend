"use client"

import React from "react"

export default function LabResults() {
    return (
        <section className="py-10 sm:py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left */}
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                            Full Transparency, Every Batch
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-5">
                            Every product ships with comprehensive documentation — HPLC chromatography, mass spectrometry, endotoxin testing, and more.
                        </p>
                        <ul className="space-y-2">
                            {[
                                "HPLC Chromatography — purity ≥99%",
                                "Mass Spectrometry — molecular identity",
                                "Endotoxin Testing — safety verification",
                                "Batch-specific COA with every order",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px]">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right - COA preview */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-emerald-700 px-4 py-2.5 flex items-center justify-between">
                            <span className="text-sm text-white font-medium">Certificate of Analysis</span>
                            <span className="text-[10px] bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full font-medium">VERIFIED</span>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div><span className="text-gray-400 block">Product</span><span className="font-medium text-gray-800">BPC-157</span></div>
                                <div><span className="text-gray-400 block">Batch</span><span className="font-medium text-gray-800">#RL-2026-0847</span></div>
                                <div><span className="text-gray-400 block">Quantity</span><span className="font-medium text-gray-800">5mg</span></div>
                                <div><span className="text-gray-400 block">MW</span><span className="font-medium text-gray-800">1419.53 g/mol</span></div>
                            </div>
                            <div className="border-t border-gray-100 pt-3 space-y-1.5">
                                {[
                                    { test: "HPLC Purity", result: "99.24%" },
                                    { test: "Mass Spec", result: "Confirmed" },
                                    { test: "Endotoxin", result: "<0.1 EU/mg" },
                                    { test: "Appearance", result: "White powder" },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded-lg">
                                        <span className="text-gray-600">{row.test}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-gray-900">{row.result}</span>
                                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[8px]">✓</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
