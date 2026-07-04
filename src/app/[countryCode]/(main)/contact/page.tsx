"use client"

import React from "react"
import { Mail, Clock, MapPin, Send } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-50 to-teal-50/30 py-16 sm:py-20">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="inline-block text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">
                            Get in Touch
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5">
                            Contact Us
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            Have questions about our products, your order, or need help with
                            something? We&apos;re here to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact content */}
            <section className="py-16 sm:py-20">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact info */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 mb-1">
                                        Email
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        support@rlaustralia.com.au
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 mb-1">
                                        Response Time
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        We typically respond within 24 hours during business days.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 mb-1">
                                        Location
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Australia-wide shipping from our domestic warehouse.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact form */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-6">
                                    Send us a message
                                </h2>
                                <form className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Your name"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="How can we help?"
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            rows={5}
                                            placeholder="Tell us more about your inquiry..."
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-7 py-3 rounded-full font-semibold text-sm shadow-lg shadow-teal-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
