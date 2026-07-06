import React from "react"
import { Metadata } from "next"
import { ShieldAlert } from "lucide-react"

export const metadata: Metadata = {
  title: "Product Disclaimer",
  description: "Important safety specifications and research disclaimer for RL Australia products.",
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-8 border-b border-gray-100 pb-4">
          Product Disclaimer
        </h1>

        <div className="prose prose-slate max-w-none text-gray-650 space-y-6 text-sm sm:text-base leading-relaxed">
          
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-6 rounded-xl text-amber-900 mb-8">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-extrabold uppercase tracking-wide mb-1 text-amber-950">
                Important Lab Safety Notification
              </h3>
              <p className="text-sm font-medium">
                Please read this document carefully before ordering any compounds from this website.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            For Laboratory Research &amp; Development Only
          </h2>
          <p>
            All products listed on this website are sold exclusively for <strong>laboratory research and development purposes</strong>. They are NOT intended, nor should they be used, for human consumption, clinical trials, therapeutic interventions, animal ingestion, veterinary uses, food, or cosmetics.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            HPLC Purity Certification &amp; Testing
          </h2>
          <p>
            While we provide HPLC/MS verified purity certifications for every compound batch, these certifications verify chemical identification and purity percentage inside a laboratory setting. They do not constitute approval or guidelines for administration to biological systems.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Buyer Obligations &amp; Compliance
          </h2>
          <p>
            By purchasing, you warrant and agree that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              You are an adult researcher or laboratory representative aged 18 or older.
            </li>
            <li>
              You understand the chemical hazards, toxicity, and proper storage requirements (e.g. lyophilized storage temperatures of -20°C).
            </li>
            <li>
              You will comply with all local, state, and federal laws of Australia regarding the handling and containment of chemical substances.
            </li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Refusal of Service
          </h2>
          <p>
            We strictly monitor incoming orders. If we have reason to believe that a customer is purchasing research compounds for personal use or non-laboratory research, we will immediately cancel the order, issue a full refund, and blacklist the account.
          </p>
        </div>
      </div>
    </div>
  )
}
