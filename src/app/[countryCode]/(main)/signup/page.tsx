"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, UserPlus } from "lucide-react"

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">RL</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">RL Australia</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Create Your Account</h1>
                    <p className="text-sm text-gray-500">Join thousands of researchers across Australia</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (Optional)</label>
                            <input
                                type="tel"
                                placeholder="+61 4XX XXX XXX"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password (min 8 chars)"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <input type="checkbox" id="terms" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5" />
                            <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                                I agree to the{" "}
                                <Link href="/terms" className="text-emerald-600 hover:underline">Terms & Conditions</Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
                                I confirm I am 18+ and purchasing for research purposes only.
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
