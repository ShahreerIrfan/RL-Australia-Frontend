import React from "react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">Products</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link href="/store" className="hover:text-sky-600 transition-colors">All Peptides</Link></li>
              <li><Link href="/categories/recovery" className="hover:text-sky-600 transition-colors">Recovery</Link></li>
              <li><Link href="/categories/muscle-growth" className="hover:text-sky-600 transition-colors">Muscle Growth</Link></li>
              <li><Link href="/categories/anti-aging" className="hover:text-sky-600 transition-colors">Anti-Aging</Link></li>
              <li><Link href="/categories/cognitive" className="hover:text-sky-600 transition-colors">Cognitive</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">Company</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link href="/about" className="hover:text-sky-600 transition-colors">About Us</Link></li>
              <li><Link href="/research" className="hover:text-sky-600 transition-colors">Research</Link></li>
              <li><Link href="/faqs" className="hover:text-sky-600 transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-sky-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">Support</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link href="/shipping-policy" className="hover:text-sky-600 transition-colors">Shipping</Link></li>
              <li><Link href="/refund-policy" className="hover:text-sky-600 transition-colors">Returns</Link></li>
              <li><Link href="/track-order" className="hover:text-sky-600 transition-colors">Track Order</Link></li>
              <li><Link href="/coa-verification" className="hover:text-sky-600 transition-colors">COA Verification</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">Legal</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link href="/terms" className="hover:text-sky-600 transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-600 transition-colors">Privacy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-sky-600 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 mb-6">
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            <strong className="text-gray-600 font-bold">Disclaimer:</strong> All products are for laboratory and research use only. Not for human consumption.
            Purchasers must be 18+ and agree to use products solely for legitimate research purposes.
          </p>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">RL</span>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400">© {new Date().getFullYear()} RL Australia. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2">
            {/* PayPal */}
            <svg className="w-9 h-6" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="PayPal">
              <rect width="36" height="24" rx="3" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1"/>
              <path d="M14 16l1.3-5.3H18c1.4 0 2.2.8 2.2 1.8 0 1.4-.9 2.2-2.4 2.2h-2l-.5 2.1H14zm1.5-4.2l-.3 1.5h1.1c.7 0 1.1-.3 1.1-.9 0-.6-.4-.9-1.1-.9h-1z" fill="#003087"/>
              <path d="M15.5 17.5l1.3-5.3H19.5c1.4 0 2.2.8 2.2 1.8 0 1.4-.9 2.2-2.4 2.2h-2l-.5 2.1h-1.6zm1.5-4.2l-.3 1.5h1.1c.7 0 1.1-.3 1.1-.9 0-.6-.4-.9-1.1-.9h-1z" fill="#0079C1" fillOpacity="0.85"/>
            </svg>
            {/* Visa */}
            <svg className="w-9 h-6" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="Visa">
              <rect width="36" height="24" rx="3" fill="#0E4595"/>
              <path d="M15.3 16.2l1.6-4.9h2.3l-1.6 4.9H15.3zm6.6-4.7c-.3-.2-.8-.3-1.3-.3-1.4 0-2.4.7-2.4 1.8 0 .8.7 1.2 1.3 1.5.6.3.8.5.8.7-.1.4-.5.5-.9.5-.7 0-1.1-.3-1.5-.4l-.2 1.3c.4.2 1.1.3 1.8.3 1.5 0 2.4-.7 2.4-1.8 0-.8-.5-1.2-1.6-1.7-.5-.3-.9-.4-.9-.7 0-.2.3-.5.9-.5.5 0 .9.2 1.2.3l.2-1.3zm4.5 1.5c.1-.3.8-2.2.8-2.2s.2.4.3.8l.5 2.4c.1.3.1.4.1.4h-1.7zm1.1-3.2h-1.3c-.4 0-.7.2-.9.6l-2.5 5.9h1.7s.3-.8.3-.9h2.1c0 .1.1.9.1.9h1.5l-1-6.5zm-17.7 0l1.6 4.2.2.9c0 .1.1.2.2.3l1.8-5.4h1.7l-2.6 6.5h-1.7l-1.5-3.8-1.5-2.7h1.3z" fill="#FFF"/>
            </svg>
            {/* Mastercard */}
            <svg className="w-9 h-6" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="Mastercard">
              <rect width="36" height="24" rx="3" fill="#1F2A44"/>
              <circle cx="15" cy="12" r="6" fill="#EB001B"/>
              <circle cx="21" cy="12" r="6" fill="#F79E1B" fillOpacity="0.85"/>
              <path d="M18 8.6c.9 1 1.4 2.2 1.4 3.4s-.5 2.4-1.4 3.4c-.9-1-1.4-2.2-1.4-3.4s.5-2.4 1.4-3.4z" fill="#FF5F00"/>
            </svg>
            {/* Amex */}
            <svg className="w-9 h-6" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="American Express">
              <rect width="36" height="24" rx="3" fill="#01A6E5"/>
              <rect x="1.5" y="1.5" width="33" height="21" rx="1.5" stroke="#FFFFFF" strokeWidth="1" fill="none"/>
              <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.2">AMEX</text>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  )
}
