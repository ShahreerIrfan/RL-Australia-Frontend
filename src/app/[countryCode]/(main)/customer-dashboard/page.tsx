"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { 
  User, Package, MapPin, LogOut, ShoppingBag, LayoutGrid, 
  Truck, Lock, ChevronRight, Mail, Calendar, Eye, 
  ShieldCheck, Loader2, ArrowRight, ClipboardList, CheckCircle2, Clock, 
  PackageCheck, ArrowLeft, Search, AlertTriangle, ExternalLink
} from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://rl.eezzymart.tech"

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

interface OrderItem {
  title: string
  quantity: number
  unit_price?: number
  thumbnail?: string
}

interface OrderDetails {
  id: string
  order_number: string
  status: string
  email: string
  created_at: string
  total: number
  tracking_number?: string | null
  tracking_provider?: string | null
  tracking_link?: string | null
  items: OrderItem[]
  shipping_address: {
    first_name?: string
    last_name?: string
    address_1?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
  }
}

type TabType = "Dashboard" | "Orders" | "Track Order" | "Addresses" | "Change Password"

export default function CustomerDashboard() {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "us"
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard")
  
  // Dashboard & Orders data
  const [orders, setOrders] = useState<OrderDetails[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)

  // Tracking tab states
  const [trackCode, setTrackCode] = useState("")
  const [trackingOrder, setTrackingOrder] = useState<OrderDetails | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackingError, setTrackingError] = useState<string | null>(null)

  // Change password states
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    const token = localStorage.getItem("auth_token")

    if (!stored || !token) {
      window.location.href = "/" + countryCode + "/login"
      return
    }

    const parsed = JSON.parse(stored)
    if (parsed.role !== "customer") {
      window.location.href = "/" + countryCode + "/login"
      return
    }

    setUser(parsed)
    setLoading(false)
    fetchOrders(parsed.email)
  }, [router])

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "user") {
        const token = localStorage.getItem("auth_token")
        const stored = localStorage.getItem("user")
        if (!token || !stored) {
          window.location.href = "/" + countryCode + "/login"
        }
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const fetchOrders = async (email: string) => {
    try {
      setOrdersLoading(true)
      const res = await fetch(`${BACKEND_URL}/store/orders?email=${encodeURIComponent(email)}`, {
        cache: "no-store"
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (e) {
      console.error("Error loading customer orders:", e)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    const { signout } = await import("@lib/data/customer")
    await signout(countryCode)
  }

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackCode) return
    fetchTrackingInfo(trackCode)
  }

  const fetchTrackingInfo = async (code: string) => {
    setTrackingLoading(true)
    setTrackingError(null)
    setTrackingOrder(null)

    try {
      const res = await fetch(`${BACKEND_URL}/store/orders/${code.trim()}`, {
        cache: "no-store"
      })
      if (!res.ok) {
        throw new Error("No shipment found matching this number.")
      }
      const data = await res.json()
      if (data && data.order) {
        setTrackingOrder(data.order)
      } else {
        throw new Error("No shipment found matching this number.")
      }
    } catch (err: any) {
      setTrackingError(err.message || "Failed to search tracking number.")
    } finally {
      setTrackingLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      return
    }

    try {
      setPasswordLoading(true)
      const res = await fetch(`${BACKEND_URL}/store/customer/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          old_password: oldPassword,
          new_password: newPassword
        })
      })

      const data = await res.json()
      if (res.ok) {
        setPasswordSuccess("Password changed successfully!")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        throw new Error(data.message || "Failed to change password.")
      }
    } catch (err: any) {
      setPasswordError(err.message || "An error occurred.")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleTrackOrderInline = (orderNumber: string) => {
    setTrackCode(orderNumber)
    setActiveTab("Track Order")
    fetchTrackingInfo(orderNumber)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin w-6 h-6 text-sky-600" />
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Loading account portal...</span>
      </div>
    )
  }

  // Get initials for profile bubble
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase()

  const tabs: { type: TabType; label: string; icon: any }[] = [
    { type: "Dashboard", label: "Dashboard", icon: LayoutGrid },
    { type: "Orders", label: "Orders", icon: ShoppingBag },
    { type: "Track Order", label: "Track shipment", icon: Truck },
    { type: "Addresses", label: "Addresses", icon: MapPin },
    { type: "Change Password", label: "Security & keys", icon: Lock },
  ]

  // Track status steps
  const steps = [
    { key: "placed", label: "Order placed", icon: Clock },
    { key: "packaged", label: "Packaged", icon: Package },
    { key: "dispatched", label: "Dispatched", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 }
  ]

  const getStepIndex = (status: string) => {
    const s = status.toLowerCase()
    if (s === "pending" || s === "confirmed") return 0
    if (s === "processing" || s === "packaged") return 1
    if (s === "shipped" || s === "dispatched") return 2
    if (s === "delivered") return 3
    return -1
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 sm:py-20 select-text text-left font-sans text-gray-800 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Continuous Seamless Sidebar (Stripe Style) */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
              {/* Profile Header Block */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 via-sky-655 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {initials || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-gray-900 truncate leading-snug">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="space-y-1.5 mt-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.type
                  return (
                    <button
                      key={tab.type}
                      onClick={() => {
                        setActiveTab(tab.type)
                        setSelectedOrder(null)
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-medium rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-sky-50 text-sky-700 border border-sky-100/50"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-sky-600" : "text-gray-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Sidebar Footer Log out */}
              <div className="pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-medium rounded-xl text-red-500 hover:bg-red-50/40 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Main Content Panels */}
          <div className="lg:col-span-9">

            {/* Tab 1: Dashboard Home */}
            {activeTab === "Dashboard" && (
              <div className="space-y-8">
                
                {/* Greeting Panel (Clean, Minimal, Non-boxy greeting) */}
                <div className="pb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                    Hello, {user?.first_name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Welcome to your personal account portal. Monitor your research orders and settings here.
                  </p>
                </div>

                {/* Dashboard KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Total orders</span>
                    <span className="text-3xl font-bold tracking-tight text-gray-900 mt-1.5 block">{orders.length}</span>
                  </div>
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">In transit</span>
                    <span className="text-3xl font-bold tracking-tight text-sky-600 mt-1.5 block">
                      {orders.filter(o => o.status === "processing" || o.status === "shipped").length}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Verification</span>
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 mt-2.5 inline-block">
                      Active client
                    </span>
                  </div>
                </div>

                {/* Quick Actions (Refined layout with detailed text labels) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quick actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/store" className="bg-white hover:bg-gray-50 border border-gray-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-start gap-4 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Explore peptides</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Browse our full catalog of research compounds.</p>
                      </div>
                    </Link>
                    <button onClick={() => setActiveTab("Track Order")} className="bg-white hover:bg-gray-50 border border-gray-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-start gap-4 transition-all text-left cursor-pointer w-full">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Track a package</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Check delivery progress or carrier information.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden text-xs">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-gray-900">Recent orders</h3>
                    {orders.length > 3 && (
                      <button onClick={() => setActiveTab("Orders")} className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                        View history &rarr;
                      </button>
                    )}
                  </div>

                  {ordersLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-5 h-5 text-gray-300" /></div>
                  ) : orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-450 space-y-3">
                      <ClipboardList className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs font-medium">No order history found for your account.</p>
                      <Link href="/store" className="inline-block text-xs font-semibold text-sky-600 hover:text-sky-700">
                        Make your first purchase →
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-medium text-gray-700">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-widest select-none">
                            <th className="px-6 py-3.5">Order</th>
                            <th className="px-6 py-3.5">Date</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5 text-right">Total</th>
                            <th className="px-6 py-3.5 text-right w-24">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                          {orders.slice(0, 3).map((ord) => (
                            <tr key={ord.id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4 font-semibold text-gray-900">{ord.order_number}</td>
                              <td className="px-6 py-4 text-gray-550">{new Date(ord.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                  ord.status === "delivered"
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : ord.status === "cancelled"
                                    ? "bg-rose-50 border-rose-100 text-rose-700"
                                    : "bg-amber-50 border-amber-100 text-amber-700"
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-semibold text-gray-900">${Number(ord.total).toFixed(2)}</td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(ord)
                                    setActiveTab("Orders")
                                  }}
                                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Tab 2: Orders List */}
            {activeTab === "Orders" && (
              <div className="space-y-6">
                
                {selectedOrder ? (
                  /* Expanded Order Detail View (Humanized spacing & design) */
                  <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden text-left animate-in fade-in duration-200">
                    
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to history</span>
                      </button>
                      <span className="text-xs font-semibold text-gray-900">
                        Order #{selectedOrder.order_number}
                      </span>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Metric info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Order placed</span>
                          <p className="text-xs font-semibold text-gray-900 mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Current Status</span>
                          <p className="text-xs font-semibold text-gray-900 mt-1 uppercase tracking-wider">{selectedOrder.status}</p>
                        </div>
                        <div className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl">
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Total amount</span>
                          <p className="text-xs font-semibold text-emerald-700 mt-1">${Number(selectedOrder.total).toFixed(2)} AUD</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items in order</h4>
                        <div className="border border-gray-200/80 rounded-xl overflow-hidden divide-y divide-gray-100">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between bg-white text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 border border-gray-200/80 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                  <img src={item.thumbnail || "/assets/peptide-vial.png"} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-900 block">{item.title}</span>
                                  <span className="text-[10px] text-gray-450 font-medium block mt-0.5">Quantity: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-semibold text-gray-900">${(Number(item.unit_price || 0) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-100 pt-5 gap-4">
                        <p className="text-xs text-gray-450 font-medium">
                          You can view carrier dispatch info or tracking page status in real time.
                        </p>
                        <button
                          onClick={() => handleTrackOrderInline(selectedOrder.order_number)}
                          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track shipment</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Purchase history list */
                  <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden text-xs">
                    <div className="px-6 py-5 border-b border-gray-100">
                      <h3 className="text-[13px] font-semibold text-gray-900">Purchase history</h3>
                    </div>

                    {ordersLoading ? (
                      <div className="p-12 flex justify-center"><Loader2 className="animate-spin w-5 h-5 text-gray-300" /></div>
                    ) : orders.length === 0 ? (
                      <div className="p-12 text-center text-gray-450 space-y-2">
                        <ClipboardList className="w-6 h-6 text-gray-300 mx-auto" />
                        <p className="font-medium">No order transactions found.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {orders.map((ord) => (
                          <div key={ord.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/40 transition-colors">
                            <div className="space-y-0.5 text-left">
                              <span className="text-xs font-semibold text-gray-900 block">#{ord.order_number}</span>
                              <span className="text-[10px] text-gray-450 font-medium block">
                                Placed on {new Date(ord.created_at).toLocaleDateString()} • {ord.items.length} items
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 justify-between sm:justify-end">
                              <span className="text-xs font-semibold text-gray-900">${Number(ord.total).toFixed(2)}</span>
                              
                              <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                ord.status === "delivered"
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                  : ord.status === "cancelled"
                                  ? "bg-rose-50 border-rose-100 text-rose-700"
                                  : "bg-amber-50 border-amber-100 text-amber-700"
                              }`}>
                                {ord.status}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-[11px] font-medium text-gray-600 rounded-lg transition-all cursor-pointer"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => handleTrackOrderInline(ord.order_number)}
                                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-[11px] font-semibold text-white rounded-lg transition-all shadow-sm cursor-pointer"
                                >
                                  Track
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* Tab 3: Dynamic Package Tracking */}
            {activeTab === "Track Order" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Clean tracking lookup form */}
                <div className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-xs text-left">
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-1">Shipment tracking</h3>
                  <p className="text-xs text-gray-400 mb-4">Input your order number or tracking reference to locate your package.</p>
                  <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4.5 w-4.5 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        value={trackCode}
                        onChange={(e) => setTrackCode(e.target.value)}
                        placeholder="e.g. ORD-1720..."
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {trackingLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>Locate parcel</span>
                    </button>
                  </form>
                </div>

                {/* Tracking Errors */}
                {trackingError && (
                  <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-start gap-3 text-xs text-left">
                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-rose-900 mb-0.5">Shipment lookup failed</h4>
                      <p className="text-rose-600 font-medium">{trackingError}</p>
                    </div>
                  </div>
                )}

                {/* Tracking order info */}
                {trackingOrder && (
                  <div className="space-y-6 animate-in fade-in duration-300 text-xs text-left">
                    
                    {/* Simplified status tracking progress bar */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery milestone</span>
                          <h4 className="text-sm font-semibold text-gray-900 mt-1">Order #{trackingOrder.order_number}</h4>
                        </div>
                        
                        {trackingOrder.status === "cancelled" ? (
                          <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            Cancelled
                          </span>
                        ) : (
                          <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            {steps[getStepIndex(trackingOrder.status)]?.label || trackingOrder.status}
                          </span>
                        )}
                      </div>

                      {trackingOrder.status === "cancelled" ? (
                        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5 text-center">
                          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-1.5" />
                          <h4 className="font-semibold text-rose-900">Shipment Cancelled</h4>
                          <p className="text-[11px] text-rose-600 mt-1">This transaction was cancelled and refunded. If you have any inquiries, contact research support.</p>
                        </div>
                      ) : (
                        /* Horizontal Bar visualization */
                        <div className="flex items-center justify-between relative px-2 mb-2">
                          <div className="absolute top-[18px] left-[5%] right-[5%] h-0.5 bg-gray-100 -z-10" />
                          <div 
                            className="absolute top-[18px] left-[5%] h-0.5 bg-sky-500 -z-10 transition-all duration-500" 
                            style={{ width: `${(getStepIndex(trackingOrder.status) / (steps.length - 1)) * 90}%` }}
                          />

                          {steps.map((step, idx) => {
                            const Icon = step.icon
                            const isCompleted = idx <= getStepIndex(trackingOrder.status)
                            
                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                  isCompleted
                                    ? "bg-sky-500 border-sky-500 text-white shadow-sm"
                                    : "bg-white border-gray-200 text-gray-400"
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-[10px] font-semibold uppercase tracking-wider mt-2.5 ${
                                  isCompleted ? "text-gray-900" : "text-gray-400"
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Carrier reference info box */}
                    {trackingOrder.tracking_number && (
                      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[10px]">Courier reference</h4>
                            <p className="font-bold text-[#047857] mt-0.5">
                              {trackingOrder.tracking_provider || "Standard carrier"}: {trackingOrder.tracking_number}
                            </p>
                          </div>
                        </div>
                        {trackingOrder.tracking_link && (
                          <a
                            href={trackingOrder.tracking_link}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#047857] hover:bg-[#035f43] text-white font-semibold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                          >
                            <span>Courier Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Destination Address details card */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-left">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
                        <MapPin className="w-4 h-4 text-gray-450" />
                        <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[10px]">Delivery destination</h4>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {trackingOrder.shipping_address.first_name || ""} {trackingOrder.shipping_address.last_name || ""}
                      </p>
                      <p className="text-gray-500 mt-1">{trackingOrder.shipping_address.address_1}</p>
                      <p className="text-gray-550">
                        {trackingOrder.shipping_address.city}, {trackingOrder.shipping_address.province}, {trackingOrder.shipping_address.postal_code}
                      </p>
                      <p className="text-gray-400 font-bold uppercase tracking-wider mt-1.5 text-[9px]">
                        {trackingOrder.shipping_address.country_code?.toUpperCase()}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Addresses List */}
            {activeTab === "Addresses" && (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-xs text-left">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                  <MapPin className="w-4.5 h-4.5 text-gray-450" />
                  <h3 className="text-sm font-semibold text-gray-900">Saved shipping addresses</h3>
                </div>

                {orders.length === 0 ? (
                  <p className="text-gray-400 font-medium italic">No shipping addresses registered yet. Addresses save here once you complete checkout purchases.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Unique address aggregation */}
                    {Array.from(new Set(orders.map(o => JSON.stringify(o.shipping_address)))).map((addrStr, idx) => {
                      const addr = JSON.parse(addrStr)
                      return (
                        <div key={idx} className="border border-gray-200/80 rounded-xl p-4 bg-gray-50/30 hover:bg-white hover:border-gray-300 transition-all space-y-1">
                          <p className="font-semibold text-gray-900">{addr.first_name} {addr.last_name}</p>
                          <p className="text-gray-500 mt-1.5">{addr.address_1}</p>
                          <p className="text-gray-500">{addr.city}, {addr.province}, {addr.postal_code}</p>
                          <p className="text-gray-400 font-bold uppercase mt-2 text-[9px] tracking-wider">{addr.country_code?.toUpperCase()}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Change Password Form */}
            {activeTab === "Change Password" && (
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-xs text-left">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                  <Lock className="w-4.5 h-4.5 text-gray-450" />
                  <h3 className="text-sm font-semibold text-gray-900">Change account password</h3>
                </div>

                {passwordError && (
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-2.5 mb-5 text-rose-700 font-medium">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-2.5 mb-5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Old password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs font-medium bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs font-medium bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs font-medium bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 focus:bg-white focus:outline-none focus:border-sky-500 transition-all"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {passwordLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Update password</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
