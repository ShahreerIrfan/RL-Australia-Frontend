import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how RL Australia gathers, utilizes, and protects customer information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 mb-8 border-b border-gray-100 pb-4">
          Privacy Policy
        </h1>

        <div className="prose prose-slate max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            This Privacy Policy describes how RL Australia collects, uses, and discloses your personal information when you visit or make a purchase from our website.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Information We Collect
          </h2>
          <p>
            When you visit the site, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Contact Information:</strong> Name, email address, billing address, shipping address, phone number.
            </li>
            <li>
              <strong>Payment Information:</strong> Standard secure billing indicators (handled directly by our payment processor, Stripe, in an encrypted format).
            </li>
            <li>
              <strong>Device &amp; Usage Information:</strong> IP address, browser type, referral URLs, page interaction statistics.
            </li>
          </ul>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p>
            We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Cookies
          </h2>
          <p>
            A cookie is a small amount of information that is downloaded to your computer or device when you visit our site. We use cookies to improve your browsing experience, store login sessions, and optimize website performance. You can manage or block cookies through your browser settings.
          </p>

          <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide mt-8 mb-4">
            Information Security
          </h2>
          <p>
            We deploy strict technical and organizational measures to safeguard your personal data. All communication between your browser and our server is secured using SSL encryption. Payment processing is completely PCI-DSS compliant.
          </p>
        </div>
      </div>
    </div>
  )
}
