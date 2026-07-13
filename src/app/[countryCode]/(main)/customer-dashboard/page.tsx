"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { 
  User, Package, MapPin, LogOut, ShoppingBag, LayoutGrid, 
  Truck, Lock, ChevronRight, Mail, Calendar, Eye, 
  ShieldCheck, Loader2, ArrowRight, ClipboardList, CheckCircle2, Clock, 
  PackageCheck, ArrowLeft, Search, AlertTriangle
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
        <Loader2 className="animate-spin w-8 h-8 text-sky-600" />
        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Verifying account...</span>
      </div>
    )
  }

  // Get initials for profile bubble
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase()

  const tabs: { type: TabType; label: string; icon: any }[] = [
    { type: "Dashboard", label: "My Account", icon: LayoutGrid },
    { type: "Orders", label: "Orders", icon: ShoppingBag },
    { type: "Track Order", label: "Track Shipment", icon: Truck },
    { type: "Addresses", label: "Addresses", icon: MapPin },
    { type: "Change Password", label: "Security Settings", icon: Lock },
  ]

  // Track status steps
  const steps = [
    { key: "placed", label: "Placed", icon: Clock },
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
    <div className="min-h-[85vh] bg-gray-50/50 py-10 sm:py-16 select-text text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar Profile & Navigation */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* User Profile Summary Card */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-amber-450 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/10 border border-white/20">
                {initials || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-black text-gray-950 truncate leading-snug">{user?.first_name} {user?.last_name}</h2>
                <p className="text-[10px] text-gray-400 font-bold truncate tracking-wide mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Sidebar Menu Links Card */}
            <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden p-3 shadow-xs space-y-1">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#047857] text-white shadow-md shadow-emerald-700/10 border border-emerald-600/10"
                        : "text-gray-550 hover:text-gray-950 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
              
              <div className="pt-2 border-t border-gray-100 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-2xl text-rose-600 hover:bg-rose-50/40 transition-all cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>Logout Account</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Active Tab Content */}
          <div className="lg:col-span-9 space-y-6">

            {/* Tab 1: Dashboard Home */}
            {activeTab === "Dashboard" && (
              <div className="space-y-6">
                
                {/* Welcome Glassmorphic Banner */}
                <div className="bg-[#1d2d3d] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden text-white">
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none">
                    <ShoppingBag className="w-full h-full object-contain" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block mb-1">CLIENT ACCESS PORTAL</span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none">
                      Welcome back, {user?.first_name}! 👋
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1">
                      Here's a summary of your orders, shipping details, and active shipments.
                    </p>
                  </div>
                </div>

                {/* Dashboard KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Total Purchases</span>
                    <span className="text-2xl font-black text-gray-950 mt-1 block">{orders.length}</span>
                  </div>
                  <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Active Shipments</span>
                    <span className="text-2xl font-black text-sky-600 mt-1 block">
                      {orders.filter(o => o.status === "processing" || o.status === "shipped").length}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Account Tier</span>
                    <span className="text-2xl font-black text-emerald-700 mt-1 block">Verified Client</span>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link href="/store" className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center hover:bg-gray-100/60 transition-all">
                      <ShoppingBag className="w-5 h-5 mx-auto text-sky-600 mb-2" />
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-wide">Browse Products</span>
                    </Link>
                    <button onClick={() => setActiveTab("Orders")} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center hover:bg-gray-100/60 transition-all cursor-pointer">
                      <Package className="w-5 h-5 mx-auto text-[#047857] mb-2" />
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-wide">My Orders</span>
                    </button>
                    <button onClick={() => setActiveTab("Track Order")} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center hover:bg-gray-100/60 transition-all cursor-pointer">
                      <Truck className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-wide">Track Shipment</span>
                    </button>
                    <button onClick={() => setActiveTab("Change Password")} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center hover:bg-gray-100/60 transition-all cursor-pointer">
                      <Lock className="w-5 h-5 mx-auto text-indigo-500 mb-2" />
                      <span className="text-[10px] font-black text-gray-800 uppercase tracking-wide">Security Settings</span>
                    </button>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-white border border-gray-150 rounded-3xl shadow-xs overflow-hidden text-xs">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Recent Orders</h3>
                    {orders.length > 3 && (
                      <button onClick={() => setActiveTab("Orders")} className="text-[10px] font-black text-sky-600 hover:text-sky-700 uppercase tracking-wider">
                        View All &rarr;
                      </button>
                    )}
                  </div>

                  {ordersLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
                  ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 font-bold italic">No orders recorded yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-semibold text-gray-700">
                        <thead>
                          <tr className="bg-gray-55/30 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">
                            <th className="px-5 py-3">Order Number</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Total</th>
                            <th className="px-5 py-3 text-right w-24">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.slice(0, 3).map((ord) => (
                            <tr key={ord.id} className="hover:bg-gray-55/10">
                              <td className="px-5 py-4 font-black text-gray-900">{ord.order_number}</td>
                              <td className="px-5 py-4 text-gray-400 font-medium">{new Date(ord.created_at).toLocaleDateString()}</td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                  ord.status === "delivered"
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : ord.status === "cancelled"
                                    ? "bg-rose-50 border-rose-100 text-rose-700"
                                    : "bg-amber-50 border-amber-100 text-amber-700"
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right font-black text-gray-900">${Number(ord.total).toFixed(2)}</td>
                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(ord)
                                    setActiveTab("Orders")
                                  }}
                                  className="text-[10px] font-black text-sky-600 hover:text-sky-700 uppercase tracking-wider cursor-pointer"
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
                  /* Expanded Order Detail View */
                  <div className="bg-white border border-gray-150 rounded-3xl shadow-xs overflow-hidden animate-in fade-in duration-200">
                    
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="w-4.5 h-4.5" />
                        <span>Back to list</span>
                      </button>
                      <span className="text-xs font-black text-gray-900">
                        Order #{selectedOrder.order_number}
                      </span>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* KPI block inside order */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Date</span>
                          <p className="text-xs font-black text-gray-900 mt-0.5">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                          <p className="text-xs font-black text-gray-900 mt-0.5 uppercase tracking-wide">{selectedOrder.status}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Grand Total</span>
                          <p className="text-xs font-black text-[#047857] mt-0.5">${Number(selectedOrder.total).toFixed(2)} AUD</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider mb-3">Order Items</h4>
                        <div className="border border-gray-150 rounded-2xl overflow-hidden divide-y divide-gray-100">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between bg-white text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 border border-gray-150 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                                  <img src={item.thumbnail || "/assets/peptide-vial.png"} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <span className="font-extrabold text-gray-950 block">{item.title}</span>
                                  <span className="text-[10px] text-gray-400 font-bold block mt-0.5">Quantity: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-black text-gray-900">${(Number(item.unit_price || 0) * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 gap-4">
                        <p className="text-[10px] text-gray-400 font-bold leading-normal">
                          Need tracking? View carrier tracking details on the track page.
                        </p>
                        <button
                          onClick={() => handleTrackOrderInline(selectedOrder.order_number)}
                          className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Track Order</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* List of orders */
                  <div className="bg-white border border-gray-150 rounded-3xl shadow-xs overflow-hidden text-xs">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Purchase History</h3>
                    </div>

                    {ordersLoading ? (
                      <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
                    ) : orders.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 font-bold italic">No orders found.</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {orders.map((ord) => (
                          <div key={ord.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-55/10 transition-colors">
                            <div className="space-y-1 text-left">
                              <span className="text-xs font-black text-gray-950 block">#{ord.order_number}</span>
                              <span className="text-[10px] text-gray-400 font-bold block">
                                Placed on {new Date(ord.created_at).toLocaleDateString()} • {ord.items.length} items
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3.5 justify-between sm:justify-end">
                              <span className="text-sm font-black text-gray-900">${Number(ord.total).toFixed(2)}</span>
                              
                              <span className={`inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                ord.status === "delivered"
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                  : ord.status === "cancelled"
                                  ? "bg-rose-50 border-rose-100 text-rose-700"
                                  : "bg-amber-50 border-amber-100 text-amber-700"
                              }`}>
                                {ord.status}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-55 text-[10px] font-bold text-gray-600 rounded-xl transition-all cursor-pointer"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => handleTrackOrderInline(ord.order_number)}
                                  className="px-3.5 py-1.5 bg-[#047857] hover:bg-[#035f43] text-[10px] font-black text-white rounded-xl transition-all shadow-sm shadow-emerald-700/10 cursor-pointer"
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

            {/* Tab 3: Track Order Widget */}
            {activeTab === "Track Order" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Input box */}
                <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-xs">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-3">Shipment Tracking</h3>
                  <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        value={trackCode}
                        onChange={(e) => setTrackCode(e.target.value)}
                        placeholder="Enter Order # or Tracking #"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-55/40 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-500 transition-all placeholder:text-gray-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {trackingLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>Search status</span>
                    </button>
                  </form>
                </div>

                {/* Error */}
                {trackingError && (
                  <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-rose-955 uppercase tracking-wider mb-1">Lookup Failed</h4>
                      <p className="text-[10px] font-bold text-rose-600 leading-normal">{trackingError}</p>
                    </div>
                  </div>
                )}

                {/* Results Widget */}
                {trackingOrder && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Progress Bar Card */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Status</span>
                          <h4 className="text-sm font-black text-gray-950 uppercase mt-0.5">Order #{trackingOrder.order_number}</h4>
                        </div>
                        
                        {trackingOrder.status === "cancelled" ? (
                          <span className="bg-rose-55 text-rose-700 border border-rose-100 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                            Cancelled
                          </span>
                        ) : (
                          <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                            {steps[getStepIndex(trackingOrder.status)]?.label || trackingOrder.status}
                          </span>
                        )}
                      </div>

                      {trackingOrder.status === "cancelled" ? (
                        <div className="bg-rose-50 border border-rose-100/80 rounded-2xl p-5 text-center">
                          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-1.5" />
                          <h4 className="text-xs font-black text-rose-900 uppercase">Order Cancelled</h4>
                          <p className="text-[10px] text-rose-600 font-semibold mt-1">This order was cancelled. Please contact support if you have questions.</p>
                        </div>
                      ) : (
                        /* Horizontal Bar */
                        <div className="flex items-center justify-between relative px-2.5">
                          <div className="absolute top-[18px] left-[5%] right-[5%] h-1 bg-gray-100 -z-10" />
                          <div 
                            className="absolute top-[18px] left-[5%] h-1 bg-sky-500 -z-10 transition-all duration-500" 
                            style={{ width: `${(getStepIndex(trackingOrder.status) / (steps.length - 1)) * 90}%` }}
                          />

                          {steps.map((step, idx) => {
                            const Icon = step.icon
                            const isCompleted = idx <= getStepIndex(trackingOrder.status)
                            
                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted
                                    ? "bg-sky-500 border-sky-500 text-white"
                                    : "bg-white border-gray-200 text-gray-400"
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-wider mt-2.5 ${
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

                    {/* Tracking details summary */}
                    {trackingOrder.tracking_number && (
                      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-wider">Tracking Reference</h4>
                            <p className="font-extrabold text-[#047857] mt-0.5">
                              {trackingOrder.tracking_provider || "Standard carrier"}: {trackingOrder.tracking_number}
                            </p>
                          </div>
                        </div>
                        {trackingOrder.tracking_link && (
                          <a
                            href={trackingOrder.tracking_link}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#047857] hover:bg-[#035f43] text-white font-black px-4 py-2 rounded-2xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Courier Page</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Destination Address */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs text-xs text-left">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-3.5 mb-3.5">
                        <MapPin className="w-4 h-4 text-gray-450" />
                        <h4 className="font-black text-gray-950 uppercase tracking-wider">Delivery Destination</h4>
                      </div>
                      <p className="font-extrabold text-gray-900">
                        {trackingOrder.shipping_address.first_name || ""} {trackingOrder.shipping_address.last_name || ""}
                      </p>
                      <p className="text-gray-550 font-semibold mt-1">{trackingOrder.shipping_address.address_1}</p>
                      <p className="text-gray-550 font-semibold">
                        {trackingOrder.shipping_address.city}, {trackingOrder.shipping_address.province}, {trackingOrder.shipping_address.postal_code}
                      </p>
                      <p className="text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                        {trackingOrder.shipping_address.country_code?.toUpperCase()}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Addresses List */}
            {activeTab === "Addresses" && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-xs text-left">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                  <MapPin className="w-5 h-5 text-gray-450" />
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Registered Addresses</h3>
                </div>

                {orders.length === 0 ? (
                  <p className="text-gray-400 font-bold italic">No shipping addresses recorded. Addresses appear here after placing orders.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Extract unique addresses from past orders */}
                    {Array.from(new Set(orders.map(o => JSON.stringify(o.shipping_address)))).map((addrStr, idx) => {
                      const addr = JSON.parse(addrStr)
                      return (
                        <div key={idx} className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50 hover:bg-white transition-all space-y-1">
                          <p className="font-extrabold text-gray-950">{addr.first_name} {addr.last_name}</p>
                          <p className="text-gray-650 font-semibold mt-1">{addr.address_1}</p>
                          <p className="text-gray-650 font-semibold">{addr.city}, {addr.province}, {addr.postal_code}</p>
                          <p className="text-gray-400 font-bold uppercase tracking-wide mt-1.5">{addr.country_code?.toUpperCase()}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Change Password Form */}
            {activeTab === "Change Password" && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-xs text-left">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                  <Lock className="w-5 h-5 text-gray-450" />
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Change Password</h3>
                </div>

                {passwordError && (
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-2.5 mb-5 font-semibold text-rose-700">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-2.5 mb-5 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-555 flex-shrink-0 mt-0.5" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Old Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-[#047857] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-[#047857] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-[#047857] transition-all"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {passwordLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Update Password</span>
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
