"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    num: "01",
    question: "Why should I buy from RL Australia?",
    answer: "We source our compounds from ISO-certified manufacturers and run double-blind third-party purity testing (99%+) on every batch. Purity certificates (COAs) are published openly for all customers.",
  },
  {
    num: "02",
    question: "How do I choose the right supplement for me?",
    answer: "We recommend using our interactive Stack Builder quiz. By selecting your wellness goals (e.g. cognitive focus, physical recovery, immune support), the tool builds a personalized stack tailored to you.",
  },
  {
    num: "03",
    question: "Does RL Australia use a 3rd party lab?",
    answer: "Yes, every batch of peptides and supplements undergoes third-party lab testing. We test for compound identity, heavy metals, and purity levels.",
  },
  {
    num: "04",
    question: "Does RL Australia offer COAs?",
    answer: "Absolutely. We are committed to complete transparency. You can view and download the Certificates of Analysis (COAs) for all active batches directly on each product's page.",
  },
  {
    num: "05",
    question: "What are nootropics?",
    answer: "Nootropics are natural or synthetic substances that can be taken to improve mental performance, memory, focus, and creativity in healthy individuals.",
  },
  {
    num: "06",
    question: "Are RL Australia products safe?",
    answer: "Our research compounds are manufactured under strict laboratory standards. When handled and stored properly according to protocols, they remain highly stable and clean.",
  },
  {
    num: "07",
    question: "Where is RL Australia located?",
    answer: "Our warehousing and dispatch facilities are located in Australia, allowing us to offer quick domestic shipping and support.",
  },
  {
    num: "08",
    question: "How fast does RL Australia ship?",
    answer: "Orders placed before 2:00 PM AEST on business days are dispatched on the same day. Express shipping usually arrives within 1-2 business days across major Australian metro areas.",
  },
]

export default function NewsletterSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-[#1c2229] text-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-widest text-white">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQs 2-Column Grid */}
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 max-w-7xl mx-auto mb-10 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="border-b border-gray-700/60 pb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-teal-400 font-black text-sm">{faq.num}</span>
                    <span className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed pl-8 mt-2 transition-all duration-300">
                    {faq.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* More Questions Button */}
        <div className="text-center mb-16">
          <Link
            href="/faqs"
            className="inline-block border border-white hover:bg-white hover:text-[#1c2229] text-white font-extrabold text-sm px-8 py-3.5 rounded transition-all uppercase tracking-wider"
          >
            More Questions?
          </Link>
        </div>

        {/* Newsletter Signup Form */}
        <div className="border-t border-gray-700/50 pt-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black uppercase tracking-wider mb-1">
              Sign Up For Our Newsletter
            </h3>
            <p className="text-sm sm:text-base text-gray-400 font-medium">
              Receive special offers and updates!
            </p>
          </div>

          <div className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-white border-none rounded px-4 py-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-teal-400 focus:outline-none placeholder:text-gray-400"
            />
            <button className="bg-[#00b2a9] hover:bg-[#00938c] text-white px-8 py-3.5 rounded text-sm sm:text-base font-extrabold uppercase tracking-wider transition-colors">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
