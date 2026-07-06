import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping options, processing times, and dispatch information for RL Australia.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-8 border-b border-gray-100 pb-4">
          Shipping Policy
        </h1>
        
        <div className="prose prose-slate max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            At RL Australia, we offer fast, secure, and reliable shipping across Australia. All orders are packed with care in discreet, temperature-insulated packaging to preserve the integrity of our compounds.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Processing &amp; Dispatch Times
          </h2>
          <p>
            Orders placed before <strong>2:00 PM AEST</strong> on business days (Monday to Friday, excluding public holidays) are dispatched on the same day. Orders placed after 2:00 PM or during weekends will be processed and shipped the following business day.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Shipping Rates &amp; Options
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Express Shipping:</strong> $15.00 flat rate Australia-wide. Orders typically arrive in 1-2 business days for metropolitan areas, and 2-3 business days for regional locations.
            </li>
            <li>
              <strong>Free Express Shipping:</strong> Available on all orders over <strong>$200.00 AUD</strong>.
            </li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Discreet &amp; Secure Packaging
          </h2>
          <p>
            All products are shipped in plain, unbranded mailers to maintain confidentiality. Fragile lyophilized vials are secured inside custom-fitted boxes with temperature preservation packs where necessary.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Tracking Your Order
          </h2>
          <p>
            A tracking number will be sent to your registered email address as soon as your order is dispatched. You can monitor the progress of your shipment through our tracking page or directly on the Australia Post tracking portal.
          </p>
        </div>
      </div>
    </div>
  )
}
