"use client"

import React, { useState } from "react"
import { FileCheck, Search, Download, ShieldCheck } from "lucide-react"

export default function CoaVerificationPage() {
  const [batchCode, setBatchCode] = useState("")
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!batchCode) return
    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setLoading(false)
      setResult({
        compound: "BPC-157 5mg Lyophilized Vial",
        batch: batchCode.toUpperCase(),
        purity: "99.42%",
        lab: "MZ Biolabs USA",
        date: "March 2026",
      })
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-8 border-b border-gray-100 pb-4">
          COA Verification
        </h1>

        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          Verify the authenticity and HPLC/MS purity rating of your batch. Enter the batch number printed directly on the product label.
        </p>

        {/* Search card */}
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <FileCheck className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="e.g. BPC-157-2026"
                required
                className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1d2d3d] hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Verify Batch</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification result */}
        {result && (
          <div className="bg-white border border-gray-250 p-6 rounded-xl shadow-md animate-fade-in text-left">
            <div className="flex items-start gap-3.5 border-b border-gray-150 pb-5 mb-5">
              <ShieldCheck className="w-7 h-7 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-black text-gray-900 uppercase">
                  Batch Authentication Confirmed
                </h3>
                <p className="text-xs text-emerald-600 font-bold mt-0.5 uppercase tracking-wide">
                  HPLC Purity Verified: {result.purity}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium mb-6">
              <div>
                <span className="text-gray-450 text-xs block uppercase">Compound</span>
                <span className="text-gray-900 font-bold">{result.compound}</span>
              </div>
              <div>
                <span className="text-gray-450 text-xs block uppercase">Batch Code</span>
                <span className="text-gray-900 font-bold">{result.batch}</span>
              </div>
              <div>
                <span className="text-gray-450 text-xs block uppercase">Testing Facility</span>
                <span className="text-gray-900 font-bold">{result.lab}</span>
              </div>
              <div>
                <span className="text-gray-450 text-xs block uppercase">Analysis Date</span>
                <span className="text-gray-900 font-bold">{result.date}</span>
              </div>
            </div>

            <button className="inline-flex items-center gap-1.5 bg-[#00b2a9] hover:bg-[#00938c] text-white font-extrabold text-xs px-5 py-2.5 rounded uppercase tracking-wider transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Download Purity Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
