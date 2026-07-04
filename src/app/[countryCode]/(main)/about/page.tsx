import React from "react"
import { Metadata } from "next"
import { Shield, FlaskConical, Users, Award } from "lucide-react"

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about RL Australia — your trusted Australian supplier of high-purity research peptides.",
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-50 to-teal-50/30 py-16 sm:py-20">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <span className="inline-block text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">
                            About Us
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5">
                            Australian-Owned.
                            <br />
                            <span className="text-teal-600">Research-Focused.</span>
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            RL Australia was founded with a single mission: to provide
                            researchers with the highest quality peptides at fair prices, backed
                            by full transparency and rigorous testing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 sm:py-20">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FlaskConical,
                                title: "Purity First",
                                desc: "Every product exceeds 99% purity with full HPLC verification.",
                            },
                            {
                                icon: Shield,
                                title: "Full Transparency",
                                desc: "COA provided with every order. Independent third-party lab testing.",
                            },
                            {
                                icon: Users,
                                title: "Customer Focused",
                                desc: "Responsive support from a knowledgeable team that understands your needs.",
                            },
                            {
                                icon: Award,
                                title: "Australian Owned",
                                desc: "Proudly Australian. Fast domestic shipping from our local warehouse.",
                            },
                        ].map((item, i) => {
                            const Icon = item.icon
                            return (
                                <div key={i} className="text-center">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100/50 mb-4">
                                        <Icon className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 sm:py-20 bg-slate-50">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
                            Our Story
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                            <p>
                                RL Australia was born from frustration with the peptide supply
                                industry. Too many suppliers cut corners — offering poor purity,
                                no documentation, and unreliable service. We believed researchers
                                deserved better.
                            </p>
                            <p>
                                We partner with world-class synthesis facilities and maintain
                                rigorous quality control. Every batch is independently tested by
                                accredited laboratories before it reaches your door.
                            </p>
                            <p>
                                Our commitment is simple: provide the highest quality research
                                peptides with complete transparency, fast shipping, and excellent
                                customer service. No compromises.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
