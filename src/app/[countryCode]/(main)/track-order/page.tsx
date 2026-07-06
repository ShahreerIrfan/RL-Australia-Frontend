"use client"

import React, { useState } from "react"
import { Truck, Search, ShieldCheck } from "lucide-react"

export default function TrackOrderPage() {
  const [trackCode, setTrackCode] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackCode) return
    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setLoading(false)
      setResult("Order found! Batch processed and packaged. Currently awaiting dispatch by Australia Post.")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-8 border-b border-gray-100 pb-4">
          Track Your Order
        </h1>

        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          Retrieve the delivery status of your shipment by entering the tracking number sent to your email address.
        </p>

        {/* Input box */}
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Truck className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="e.g. RL-98234-AU"
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
                  <span>Search Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking results */}
        {result && (
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm animate-fade-in flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-extrabold text-gray-900 mb-1">
                Tracking Details Found
              </h4>
              <p className="text-sm text-gray-650 leading-relaxed font-medium">
                {result}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
