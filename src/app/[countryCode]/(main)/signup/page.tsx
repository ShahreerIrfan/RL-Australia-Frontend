"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function SignupPage() {
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
      setError("Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${BACKEND_URL}/store/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify(form),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        if (res.status === 502 || text.includes("Bad Gateway")) {
          setError("Our backend database is currently starting up. Please wait a minute and try again.")
        } else {
          setError("An unexpected server error occurred. Please try again.")
        }
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError(data.message || "Registration failed. Check details.")
        setLoading(false)
        return
      }

      setSuccess(true)
      if (data.token) {
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Set cookie for session persistence (infinite session, e.g. 20 years)
        const maxAge = 60 * 60 * 24 * 365 * 20 // 20 years
        document.cookie = `_medusa_jwt=${data.token}; path=/; max-age=${maxAge}; SameSite=Strict; ${window.location.protocol === "https:" ? "Secure" : ""}`

        setTimeout(() => {
          window.location.href = "/customer-dashboard"
        }, 1500)
      } else {
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      }
    } catch (err: any) {
      setError("Unable to connect to the server. Our database might still be starting up.")
      setLoading(false)
    }
  }

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#ecfdf5]">
      <div className="w-full max-w-md">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-[#00b2a9] flex items-center justify-center shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-black text-base tracking-wide">RL</span>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              RL Australia
            </span>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl p-8 sm:p-10 text-left">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Join to order research peptides and track shipments.
            </p>
          </div>

          {success && (
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs sm:text-sm p-4 rounded-lg mb-6 font-semibold">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>Account created! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm p-4 rounded-lg mb-6 leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => updateForm("first_name", e.target.value)}
                  placeholder="John"
                  required
                  className="w-full border border-gray-200 focus:border-[#00b2a9] rounded-lg px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-gray-400 font-medium bg-white/70"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => updateForm("last_name", e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full border border-gray-200 focus:border-[#00b2a9] rounded-lg px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-gray-400 font-medium bg-white/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full border border-gray-200 focus:border-[#00b2a9] rounded-lg px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-gray-400 font-medium bg-white/70"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="+61 4XX XXX XXX"
                className="w-full border border-gray-200 focus:border-[#00b2a9] rounded-lg px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-gray-400 font-medium bg-white/70"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  className="w-full border border-gray-200 focus:border-[#00b2a9] rounded-lg px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-gray-400 pr-10 font-medium bg-white/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:outline-none mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed font-medium">
                I agree to the <Link href="/terms" className="text-[#00b2a9] hover:underline font-extrabold">Terms</Link> and{" "}
                <Link href="/privacy" className="text-[#00b2a9] hover:underline font-extrabold">Privacy Policy</Link>. I confirm I am 18+ and purchasing for research purposes only.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 bg-[#00b2a9] hover:bg-[#00938c] disabled:bg-teal-300 text-white py-3.5 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all shadow-md shadow-teal-500/10 active:scale-[0.98] mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-150 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#00b2a9] hover:text-[#00938c] font-extrabold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
