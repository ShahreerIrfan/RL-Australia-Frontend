"use client"

import React, { useState, useEffect } from "react"
import { 
  Truck, Search, ShieldCheck, CheckCircle2, Clock, Package, 
  AlertTriangle, ChevronRight, ExternalLink, Calendar, MapPin, 
  ShoppingBag, ClipboardList
} from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://rl.eezzymart.tech"

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

export default function TrackOrderPage() {
  const [trackCode, setTrackCode] = useState("")
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Retrieve trackCode from URL search params on mount (if redirected from email/invoice)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")
      if (code) {
        setTrackCode(code)
        fetchOrderDetails(code)
      }
    }
  }, [])

  const fetchOrderDetails = async (code: string) => {
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const cleanCode = code.trim()
      const res = await fetch(`${BACKEND_URL}/store/orders/${cleanCode}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Order not found. Please double-check your order/tracking number.")
        }
        throw new Error("Failed to fetch order details. Please try again.")
      }

      const data = await res.json()
      if (data && data.order) {
        setOrder(data.order)
      } else {
        throw new Error("No order found matching this tracking number.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackCode) return
    
    // Update URL query param for easy sharing/reloading
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("code", trackCode.trim())
      window.history.replaceState({}, "", url.toString())
    }

    fetchOrderDetails(trackCode)
  }

  // Define steps and mapping of order status values
  const steps = [
    { key: "placed", label: "Placed", desc: "Order Placed", icon: Clock },
    { key: "packaged", label: "Packaged", desc: "Processed & Packaged", icon: Package },
    { key: "dispatched", label: "Dispatched", desc: "Dispatched (Awaiting Courier)", icon: Truck },
    { key: "delivered", label: "Delivered", desc: "Delivered Successfully", icon: CheckCircle2 }
  ]

  const getActiveStepIndex = (status: string) => {
    const s = status.toLowerCase()
    if (s === "pending" || s === "confirmed") return 0
    if (s === "processing" || s === "packaged") return 1
    if (s === "shipped" || s === "dispatched") return 2
    if (s === "delivered") return 3
    return -1
  }

  const activeStepIdx = order ? getActiveStepIndex(order.status) : -1

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 sm:py-20 select-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Breadcrumb / Page Title */}
        <div className="mb-8">
          <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest block mb-1">MONITOR YOUR SHIPMENT</span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900 leading-none">
            Order Tracking
          </h1>
        </div>

        {/* Input Form Box */}
        <div className="bg-white border border-gray-150 p-6 sm:p-8 rounded-3xl shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={trackCode}
                onChange={(e) => setTrackCode(e.target.value)}
                placeholder="Enter Order # or Tracking #"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-gray-55/40 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-500 transition-all placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-2xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-2 border-gray-950"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Track Package</span>
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-200 flex items-start gap-3 mb-8">
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-rose-955 uppercase tracking-wider mb-1">Lookup Failed</h4>
              <p className="text-xs font-semibold text-rose-700 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Tracking Details Results */}
        {order && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Tracking Progress Bar Card */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-8">
                <div>
                  <h3 className="text-base font-black text-gray-950 uppercase tracking-tight">
                    Order Status: <span className="text-sky-600">{order.order_number}</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    Placed on {new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "long" })}
                  </p>
                </div>
                
                {order.status === "cancelled" ? (
                  <span className="bg-rose-55 text-rose-750 border border-rose-100 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    Cancelled
                  </span>
                ) : (
                  <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    {steps[activeStepIdx]?.label || order.status}
                  </span>
                )}
              </div>

              {order.status === "cancelled" ? (
                <div className="bg-rose-50 border border-rose-100/80 rounded-2xl p-6 text-center">
                  <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                  <h4 className="text-sm font-black text-rose-900 uppercase">Order Cancelled</h4>
                  <p className="text-xs text-rose-600 font-semibold mt-1">This order has been cancelled and refunded. If you have questions, contact support.</p>
                </div>
              ) : (
                /* Progress bar visualization */
                <div>
                  {/* Desktop Horizontal Line */}
                  <div className="hidden sm:flex items-center justify-between relative px-4 mb-3">
                    {/* Background Line */}
                    <div className="absolute top-[18px] left-[5%] right-[5%] h-1 bg-gray-100 -z-10" />
                    
                    {/* Active Progress Line */}
                    <div 
                      className="absolute top-[18px] left-[5%] h-1 bg-sky-500 -z-10 transition-all duration-500" 
                      style={{ width: `${(activeStepIdx / (steps.length - 1)) * 90}%` }}
                    />

                    {steps.map((step, idx) => {
                      const Icon = step.icon
                      const isCompleted = idx <= activeStepIdx
                      const isActive = idx === activeStepIdx
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center max-w-[150px]">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/10"
                              : "bg-white border-gray-200 text-gray-400"
                          } ${isActive ? "ring-4 ring-sky-100 animate-pulse-subtle" : ""}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider mt-3 ${
                            isCompleted ? "text-gray-950" : "text-gray-400 font-bold"
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Mobile Vertical Steps */}
                  <div className="sm:hidden space-y-6 relative pl-6">
                    {/* Vertical Line */}
                    <div className="absolute top-2 bottom-2 left-2.5 w-0.5 bg-gray-100 -z-10" />
                    <div 
                      className="absolute top-2 left-2.5 w-0.5 bg-sky-500 -z-10 transition-all duration-500" 
                      style={{ height: `${(activeStepIdx / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, idx) => {
                      const Icon = step.icon
                      const isCompleted = idx <= activeStepIdx
                      const isActive = idx === activeStepIdx
                      
                      return (
                        <div key={step.key} className="flex items-start gap-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                            isCompleted
                              ? "bg-sky-500 border-sky-500 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-400"
                          } ${isActive ? "ring-2 ring-sky-100" : ""}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <div>
                            <span className={`text-xs font-black uppercase tracking-wider block ${
                              isCompleted ? "text-gray-950" : "text-gray-400"
                            }`}>
                              {step.label}
                            </span>
                            <span className="text-[10px] text-gray-450 font-bold block mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Reference & Carrier Box */}
            {order.tracking_number && (
              <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Tracking Information</h4>
                    <p className="text-sm font-extrabold text-[#047857] mt-0.5">
                      {order.tracking_provider || "Carrier"}: {order.tracking_number}
                    </p>
                  </div>
                </div>
                {order.tracking_link && (
                  <a
                    href={order.tracking_link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-[#047857] hover:bg-[#035f43] text-white text-xs font-black px-5 py-2.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Track Package</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Grid layout for Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Shipment Items & Address */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Items Card */}
                <div className="bg-white border border-gray-150 rounded-3xl shadow-sm overflow-hidden text-left">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Items in Shipment</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-55/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 border border-gray-150 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                            <img 
                              src={item.thumbnail || "/assets/peptide-vial.png"} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=100&q=80"
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-extrabold text-gray-900 block text-xs sm:text-sm leading-snug">{item.title}</span>
                            <span className="text-[10px] text-gray-400 font-bold block mt-0.5 uppercase tracking-wide">
                              Quantity: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm text-xs text-left">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3.5 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Delivery Destination</h3>
                  </div>
                  <p className="font-extrabold text-gray-950 text-sm">
                    {order.shipping_address.first_name || ""} {order.shipping_address.last_name || ""}
                  </p>
                  <p className="text-gray-600 font-semibold mt-1.5">{order.shipping_address.address_1}</p>
                  <p className="text-gray-600 font-semibold">
                    {order.shipping_address.city}, {order.shipping_address.province}, {order.shipping_address.postal_code}
                  </p>
                  <p className="text-gray-400 font-bold uppercase tracking-wider mt-1">
                    {order.shipping_address.country_code?.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Right Column: Summaries & Support info */}
              <div className="md:col-span-4 space-y-6">
                
                {/* Summary Info */}
                <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm text-xs text-left space-y-3.5">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">Shipment Summary</h4>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-semibold">Carrier</span>
                    <span className="font-extrabold text-gray-900">{order.tracking_provider || "Standard Courier"}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-semibold">Items Count</span>
                    <span className="font-extrabold text-gray-900">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 pt-3">
                    <span className="font-semibold">Status Update</span>
                    <span className="font-extrabold text-gray-900">Live</span>
                  </div>
                </div>

                {/* Need Help Card */}
                <div className="bg-[#1d2d3d] rounded-3xl p-5 text-white shadow-sm text-left">
                  <h4 className="text-xs font-black uppercase tracking-wider mb-1">Need Support?</h4>
                  <p className="text-[10px] text-gray-300 font-semibold leading-relaxed">
                    If you have questions about your delivery status or need to make updates, contact our support team.
                  </p>
                  <a
                    href="mailto:support@rlaustralia.com.au"
                    className="mt-4 w-full bg-white/10 hover:bg-white/15 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Contact Helpdesk</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
