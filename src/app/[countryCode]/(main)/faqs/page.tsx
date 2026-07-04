"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "Are your peptides suitable for human consumption?",
        answer:
            "No. All products sold by RL Australia are intended strictly for laboratory and research purposes only. They are not intended for human consumption, veterinary use, or for any diagnostic purposes.",
    },
    {
        question: "What purity levels do your peptides have?",
        answer:
            "All our peptides exceed 99% purity as verified by HPLC analysis. Each product comes with a Certificate of Analysis (COA) from an independent third-party laboratory confirming purity, identity, and composition.",
    },
    {
        question: "How are your products shipped?",
        answer:
            "We ship all orders in plain, discreet packaging with no product identifiers on the outside. Orders are dispatched from our Australian warehouse within 24 hours on business days. Standard shipping takes 2-5 business days depending on location.",
    },
    {
        question: "Do you offer free shipping?",
        answer:
            "Yes! We offer free standard shipping on all orders over $200 AUD. Orders under $200 have a flat shipping rate of $9.99 for standard or $15.99 for express delivery.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept credit/debit cards (Visa, Mastercard) through our secure payment processor. All transactions are encrypted with bank-grade security.",
    },
    {
        question: "Can I return or exchange products?",
        answer:
            "Due to the nature of our products and quality control requirements, we cannot accept returns of opened products. Unopened products may be returned within 14 days of delivery. Please contact our support team for assistance.",
    },
    {
        question: "How should I store the peptides?",
        answer:
            "Lyophilized (freeze-dried) peptides should be stored at -20°C for long-term storage or 2-8°C for short-term (up to 4 weeks). Once reconstituted, peptides should be refrigerated and used within the timeframe specified on the product page.",
    },
    {
        question: "Do you ship internationally?",
        answer:
            "Currently, we only ship within Australia. We are working on expanding our shipping options to include international destinations in the future.",
    },
]

function FAQItem({
    question,
    answer,
    isOpen,
    onToggle,
}: {
    question: string
    answer: string
    isOpen: boolean
    onToggle: () => void
}) {
    return (
        <div className="border-b border-slate-100 last:border-b-0">
            <button
                className="flex items-center justify-between w-full py-5 text-left"
                onClick={onToggle}
            >
                <span className="text-base font-semibold text-slate-800 pr-4">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-5" : "max-h-0"
                    }`}
            >
                <p className="text-sm text-slate-500 leading-relaxed">{answer}</p>
            </div>
        </div>
    )
}

export default function FAQsPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-50 to-teal-50/30 py-16 sm:py-20">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="inline-block text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">
                            Support
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            Find answers to common questions about our products, shipping,
                            and policies.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ list */}
            <section className="py-16 sm:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y-0 px-6 sm:px-8">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onToggle={() =>
                                    setOpenIndex(openIndex === index ? null : index)
                                }
                            />
                        ))}
                    </div>

                    {/* Still have questions */}
                    <div className="mt-12 text-center">
                        <p className="text-slate-500 mb-4">Still have questions?</p>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-teal-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
