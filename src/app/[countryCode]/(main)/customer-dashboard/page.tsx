"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { User, Package, MapPin, LogOut, ShoppingBag } from "lucide-react"

interface UserData {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
}

export default function CustomerDashboard() {
    const router = useRouter()
    const params = useParams()
    const countryCode = (params?.countryCode as string) || "us"
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem("user")
        const token = localStorage.getItem("auth_token")

        if (!stored || !token) {
            router.push("/login")
            return
        }

        const parsed = JSON.parse(stored)
        if (parsed.role !== "customer") {
            router.push("/login")
            return
        }

        setUser(parsed)
        setLoading(false)
    }, [router])

    // Listen for storage changes from other tabs to enforce immediate logout
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "auth_token" || e.key === "user") {
                const token = localStorage.getItem("auth_token")
                const stored = localStorage.getItem("user")
                if (!token || !stored) {
                    window.location.href = "/login"
                }
            }
        }
        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    const handleLogout = async () => {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user")
        const { signout } = await import("@lib/data/customer")
        await signout(countryCode)
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] bg-gray-50 py-8 sm:py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Welcome back, {user?.first_name}!
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage your account and orders</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-2 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                {/* Dashboard grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Profile */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">My Profile</h3>
                                <p className="text-xs text-gray-400">Personal information</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600"><span className="text-gray-400">Name:</span> {user?.first_name} {user?.last_name}</p>
                            <p className="text-gray-600"><span className="text-gray-400">Email:</span> {user?.email}</p>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">My Orders</h3>
                                <p className="text-xs text-gray-400">Track your purchases</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">No orders yet</p>
                        <Link href="/store" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                            Start Shopping →
                        </Link>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Addresses</h3>
                                <p className="text-xs text-gray-400">Shipping addresses</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">No saved addresses</p>
                    </div>
                </div>

                {/* Recent activity / CTA */}
                <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6 text-center">
                    <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Ready to order?</h3>
                    <p className="text-sm text-gray-500 mb-4">Browse our catalog of research-grade peptides</p>
                    <Link href="/store" className="inline-flex items-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                        Browse Peptides →
                    </Link>
                </div>
            </div>
        </div>
    )
}
