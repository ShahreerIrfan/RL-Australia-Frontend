import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description: "Learn about refund options, return processes, and batch guarantees at RL Australia.",
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-8 border-b border-gray-100 pb-4">
          Refund &amp; Return Policy
        </h1>

        <div className="prose prose-slate max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Due to the nature of our products as research-grade compounds and laboratory chemicals, we maintain a strict policy regarding returns and refunds to guarantee quality control and prevent batch contamination.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Damaged or Faulty Items
          </h2>
          <p>
            If your package is damaged during transit or if you receive incorrect products, please contact us within <strong>7 days</strong> of delivery. We will issue a replacement shipment immediately upon receiving photographic evidence of the damaged parcel or incorrect items.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Unopened Items
          </h2>
          <p>
            We accept returns of unopened boxes in their original condition within <strong>14 days</strong> of receipt. However, because our peptides require strict temperature-controlled storage, any returned products must undergo inspection before a refund is issued.
          </p>
          <p>
            Shipping costs for returns of non-damaged items are the responsibility of the customer. A restocking fee of 15% may apply to inspect and re-verify batch purity.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Process for Returns
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Email support with your order number and explanation.
            </li>
            <li>
              Once approved, our team will provide a return shipping address.
            </li>
            <li>
              Ship the items securely in their original packaging.
            </li>
            <li>
              Upon receipt and laboratory inspection, we will issue your refund to the original payment method within 5-7 business days.
            </li>
          </ol>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Cancellations
          </h2>
          <p>
            Orders can be cancelled and fully refunded prior to dispatch. Once an order has been dispatched (typically by 2:00 PM AEST on business days), cancellation is no longer possible.
          </p>
        </div>
      </div>
    </div>
  )
}
