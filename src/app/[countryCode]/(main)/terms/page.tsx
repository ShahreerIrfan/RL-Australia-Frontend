import React from "react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions of service for RL Australia research compound purchases.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-8 border-b border-gray-100 pb-4">
          Terms &amp; Conditions
        </h1>

        <div className="prose prose-slate max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to RL Australia. These terms and conditions outline the rules and regulations for the purchase and handling of our products. By accessing this website or purchasing our products, you agree to comply with and be bound by these terms.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            1. Research Use Only Disclaimer
          </h2>
          <p className="bg-red-50/50 border border-red-100 p-5 rounded-lg text-red-800">
            <strong>CRITICAL:</strong> All products supplied by RL Australia are sold strictly for <strong>in-vitro laboratory research and development purposes</strong>. They are NOT intended for human consumption, therapeutic use, veterinary use, cosmetics, food additives, or any other unauthorized applications.
          </p>
          <p>
            By purchasing, you acknowledge and guarantee that you have the necessary laboratory equipment, qualifications, and safety protocols to handle these compounds in a controlled environment.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            2. Age Restrictions
          </h2>
          <p>
            You must be at least <strong>18 years of age</strong> to purchase products from this website. We reserve the right to verify credentials or refuse service if we suspect an order is intended for non-research purposes or does not meet our safety guidelines.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            3. Purchase and Payments
          </h2>
          <p>
            All prices listed on our store are in Australian Dollars (AUD). Payments are processed securely via SSL-encrypted payment gateways. Orders will only be processed and dispatched once full payment is verified.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            4. Limitation of Liability
          </h2>
          <p>
            RL Australia shall not be held liable for any damages, losses, or side effects resulting from the handling, misuse, storage, or accidental ingestion of our research compounds. It is the researcher&apos;s responsibility to comply with local bio-safety regulations.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            5. Governing Law
          </h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Australia. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Australia.
          </p>
        </div>
      </div>
    </div>
  )
}
