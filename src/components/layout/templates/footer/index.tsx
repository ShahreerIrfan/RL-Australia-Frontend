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
              <li><Link href="/store" className="hover:text-emerald-600 transition-colors">All Peptides</Link></li>
              <li><Link href="/categories/recovery" className="hover:text-emerald-600 transition-colors">Recovery</Link></li>
              <li><Link href="/categories/muscle-growth" className="hover:text-emerald-600 transition-colors">Muscle Growth</Link></li>
              <li><Link href="/categories/anti-aging" className="hover:text-emerald-600 transition-colors">Anti-Aging</Link></li>
              <li><Link href="/categories/cognitive" className="hover:text-emerald-600 transition-colors">Cognitive</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">Company</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link href="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
              <li><Link href="/research" className="hover:text-emerald-600 transition-colors">Research</Link></li>
              <li><Link href="/faqs" className="hover:text-emerald-600 transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">Support</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link href="/shipping-policy" className="hover:text-emerald-600 transition-colors">Shipping</Link></li>
              <li><Link href="/refund-policy" className="hover:text-emerald-600 transition-colors">Returns</Link></li>
              <li><Link href="/track-order" className="hover:text-emerald-600 transition-colors">Track Order</Link></li>
              <li><Link href="/coa-verification" className="hover:text-emerald-600 transition-colors">COA Verification</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2.5">Legal</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-emerald-600 transition-colors">Disclaimer</Link></li>
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
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">RL</span>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400">© {new Date().getFullYear()} RL Australia. All rights reserved.</span>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-400">Visa · Mastercard · Bank Transfer</span>
        </div>
      </div>
    </footer>
  )
}
