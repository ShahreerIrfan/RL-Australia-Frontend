"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginPage() {
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
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Sign in to your account to continue</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <Link href="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
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

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
