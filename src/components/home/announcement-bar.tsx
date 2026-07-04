"use client"

import React from "react"
import { Truck, Shield, FlaskConical, Clock } from "lucide-react"

export default function AnnouncementBar() {
  return (
    <section className="bg-gray-950 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-1 text-[11px] sm:text-xs text-gray-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            Free Shipping Over $200
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            Third-Party Lab Tested
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Secure Checkout
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Same-Day Dispatch Before 2pm
          </span>
        </div>
      </div>
    </section>
  )
}
