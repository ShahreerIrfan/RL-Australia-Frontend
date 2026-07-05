"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function SignupPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters")
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`${BACKEND_URL}/store/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Registration failed")
                setLoading(false)
                return
            }

            setSuccess(true)
            if (data.token) {
                localStorage.setItem("auth_token", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                setTimeout(() => router.push("/customer-dashboard"), 1500)
            } else {
                setTimeout(() => router.push("/login"), 2000)
            }
        } catch (err: any) {
            setError("Unable to connect to server. Please try again.")
            setLoading(false)
        }
    }

    const updateForm = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 bg-gray-50">
            <div className="w-full max-w-md">
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

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    {success && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-4">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            Account created! Redirecting to login...
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    value={form.first_name}
                                    onChange={(e) => updateForm("first_name", e.target.value)}
                                    placeholder="John"
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    value={form.last_name}
                                    onChange={(e) => updateForm("last_name", e.target.value)}
                                    placeholder="Doe"
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => updateForm("email", e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (Optional)</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => updateForm("phone", e.target.value)}
                                placeholder="+61 4XX XXX XXX"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => updateForm("password", e.target.value)}
                                    placeholder="Min 8 characters"
                                    required
                                    minLength={8}
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
                            <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mt-0.5" />
                            <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                                I agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>. I confirm I am 18+ and purchasing for research purposes only.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full flex items-center justify-center gap-2 bg-[#047857] hover:bg-[#065f46] disabled:bg-emerald-300 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
