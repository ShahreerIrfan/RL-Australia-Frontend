"use client"

import React, { useState, useEffect } from "react"
import { 
  ArrowLeft, Printer, Eye, Search, Package, FileText, Loader2,
  ChevronDown, ChevronRight, Menu, X, Bell, Mail,
  ExternalLink, Moon, Clock, Star, Award, TrendingUp,
  Percent, Settings, ClipboardList, BookOpen, Target, Activity
} from "lucide-react"
import { convertToLocale } from "@lib/util/money"

interface OrderManagementProps {
  orders: any[]
  ordersLoading: boolean
  updatingOrderStatus: string | null
  updatingOrderTracking: string | null
  fetchOrders: () => Promise<void>
  updateOrderParameters: (id: string, params: { status?: string; payment_status?: string; shipping_method?: string; tracking_number?: string }) => Promise<void>
  updateOrderTracking: (id: string, provider: string, num: string, link: string) => Promise<void>
  addOrderPrivateNote: (id: string, noteText: string) => Promise<void>
  countryCode: string
}

export default function OrderManagement({
  orders,
  ordersLoading,
  updatingOrderStatus,
  updatingOrderTracking,
  fetchOrders,
  updateOrderParameters,
  updateOrderTracking,
  addOrderPrivateNote,
  countryCode
}: OrderManagementProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [orderFilter, setOrderFilter] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Tracking and notes inputs
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingProvider, setTrackingProvider] = useState("")
  const [trackingLink, setTrackingLink] = useState("")
  const [privateNote, setPrivateNote] = useState("")

  // Sync tracking input states when selected order changes
  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find(o => o.id === selectedOrderId)
      if (order) {
        setTrackingNumber(order.tracking_number || "")
        setTrackingProvider(order.tracking_provider || "")
        setTrackingLink(order.tracking_link || "")
      }
    }
  }, [selectedOrderId, orders])

  if (selectedOrderId) {
    const order = orders.find(o => o.id === selectedOrderId)
    if (!order) {
      return (
        <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-xs">
          <h3 className="text-sm font-black text-gray-900 mb-1">Order not found</h3>
          <button onClick={() => setSelectedOrderId(null)} className="text-xs font-bold text-sky-600 hover:text-sky-700 mt-2">
            Back to Orders list
          </button>
        </div>
      )
    }

    const sAddr = order.shipping_address || {}
    const bAddr = order.billing_address || {}
    const itemsList = order.items || []

    return (
      <div className="space-y-6 select-text text-left">
        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Orders
            </button>
            <h1 className="text-lg font-black text-gray-900">
              Order <span className="text-[#db2777]">#{order.order_number || order.id.slice(0, 8)}</span>
            </h1>
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              order.status === "delivered"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : order.status === "cancelled"
                ? "bg-rose-50 border-rose-100 text-rose-700"
                : "bg-amber-50 border-amber-100 text-amber-700"
            }`}>
              • {order.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${countryCode}/order/${order.id}/confirmed`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-55 text-xs font-bold text-gray-700 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" /> View Invoice
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#db2777] hover:bg-[#c0155a] text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-pink-600/10"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Order particulars */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Status Settings Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    id="detail-order-status"
                    defaultValue={order.status}
                    className="w-full text-xs font-bold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Payment</label>
                  <select
                    id="detail-order-payment"
                    defaultValue={order.payment_status || "pending"}
                    className="w-full text-xs font-bold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Shipping Method</label>
                  <select
                    id="detail-order-shipping-method"
                    defaultValue={order.shipping_method || "Standard Delivery"}
                    className="w-full text-xs font-bold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all cursor-pointer"
                  >
                    <option value="Standard Delivery">Standard Delivery</option>
                    <option value="Inside Dhaka - Standard">Inside Dhaka - Standard</option>
                    <option value="Outside Dhaka - Express">Outside Dhaka - Express</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tracking Number</label>
                  <input
                    type="text"
                    id="detail-order-tracking-num"
                    defaultValue={order.tracking_number || ""}
                    placeholder="Tracking No"
                    className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    const st = (document.getElementById("detail-order-status") as HTMLSelectElement).value
                    const pay = (document.getElementById("detail-order-payment") as HTMLSelectElement).value
                    const ship = (document.getElementById("detail-order-shipping-method") as HTMLSelectElement).value
                    const trk = (document.getElementById("detail-order-tracking-num") as HTMLInputElement).value
                    updateOrderParameters(order.id, {
                      status: st,
                      payment_status: pay,
                      shipping_method: ship,
                      tracking_number: trk
                    })
                  }}
                  disabled={updatingOrderStatus === order.id}
                  className="px-5 py-2 bg-gray-850 hover:bg-gray-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Customer & Info Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs text-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 text-left">
                  <h4 className="font-bold text-gray-450 uppercase tracking-wider text-[10px]">Customer</h4>
                  <p className="font-extrabold text-gray-900 text-sm">{sAddr.first_name || ""} {sAddr.last_name || "Guest Customer"}</p>
                  <p className="text-gray-500 font-medium">{order.email}</p>
                  <p className="text-gray-550 font-bold">{sAddr.phone || "No phone number"}</p>
                </div>
                <div className="space-y-1.5 text-left">
                  <h4 className="font-bold text-gray-455 uppercase tracking-wider text-[10px]">Sold By</h4>
                  <p className="font-extrabold text-gray-900 text-sm">RL Australia</p>
                  <p className="text-gray-500 font-medium">Store ID: 1</p>
                </div>
                <div className="space-y-1.5 text-left">
                  <h4 className="font-bold text-gray-455 uppercase tracking-wider text-[10px]">Order Info</h4>
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>Order #</span>
                    <span className="text-gray-900 font-black">{order.order_number || order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>Order Date</span>
                    <span className="text-gray-900 font-extrabold">{new Date(order.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>Total Amount</span>
                    <span className="text-[#db2777] font-black">{convertToLocale({ amount: order.total, currency_code: "aud" })}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                    <span>Payment Method</span>
                    <span className="text-gray-900 font-extrabold">Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 text-left">
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100 pb-2">Billing Address</h4>
                  <p className="font-extrabold text-gray-900">{bAddr.first_name || sAddr.first_name || ""} {bAddr.last_name || sAddr.last_name || ""}</p>
                  <p className="text-gray-600 font-medium">{bAddr.address_1 || sAddr.address_1 || "N/A"}</p>
                  <p className="text-gray-600 font-medium">{bAddr.city || sAddr.city || ""}, {bAddr.province || sAddr.province || ""}, {bAddr.postal_code || sAddr.postal_code || ""}</p>
                  <p className="text-gray-500 font-semibold">{bAddr.country_code?.toUpperCase() || sAddr.country_code?.toUpperCase() || "AU"}</p>
                </div>
                <div className="space-y-2 text-left">
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-100 pb-2">Shipping Address</h4>
                  <p className="font-extrabold text-gray-900">{sAddr.first_name || ""} {sAddr.last_name || ""}</p>
                  <p className="text-gray-600 font-medium">{sAddr.address_1 || "N/A"}</p>
                  <p className="text-gray-600 font-medium">{sAddr.city || ""}, {sAddr.province || ""}, {sAddr.postal_code || ""}</p>
                  <p className="text-gray-500 font-semibold">{sAddr.country_code?.toUpperCase() || "AU"}</p>
                </div>
              </div>
            </div>

            {/* Items Table Card */}
            <div className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-gray-55/40 border-b border-gray-150 text-[10px] font-bold text-gray-450 uppercase tracking-wider">
                      <th className="px-5 py-3 w-10 text-center">#</th>
                      <th className="px-5 py-3 w-16">Photo</th>
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3">Delivery Type</th>
                      <th className="px-5 py-3 text-center">Qty</th>
                      <th className="px-5 py-3 text-right">Gross Amount</th>
                      <th className="px-5 py-3 text-right">Discount</th>
                      <th className="px-5 py-3 text-right">Tax</th>
                      <th className="px-5 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                    {itemsList.map((item: any, idx: number) => {
                      const itemPrice = Number(item.unit_price || item.unit_amount || 0)
                      const totalItemPrice = itemPrice * item.quantity
                      return (
                        <tr key={idx} className="hover:bg-gray-50/30">
                          <td className="px-5 py-4 text-center font-bold text-gray-400">{idx + 1}</td>
                          <td className="px-5 py-4">
                            <div className="w-10 h-10 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                              <img
                                src={item.thumbnail || "/assets/peptide-vial.png"}
                                alt={item.title}
                                className="max-w-full max-h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-extrabold text-gray-900 block">{item.title}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">SKU: {item.sku || "N/A"}</span>
                          </td>
                          <td className="px-5 py-4 font-medium text-gray-500">
                            {order.shipping_method || "Standard Delivery"}
                          </td>
                          <td className="px-5 py-4 text-center font-extrabold text-gray-950">{item.quantity}</td>
                          <td className="px-5 py-4 text-right">
                            {convertToLocale({ amount: itemPrice, currency_code: "aud" })}
                          </td>
                          <td className="px-5 py-4 text-right">A$0.00</td>
                          <td className="px-5 py-4 text-right">A$0.00</td>
                          <td className="px-5 py-4 text-right font-extrabold text-gray-900">
                            {convertToLocale({ amount: totalItemPrice, currency_code: "aud" })}
                          </td>
                        </tr>
                      )
                    })}

                    {/* Shipping items row */}
                    <tr className="bg-gray-50/30">
                      <td className="px-5 py-4 text-center font-bold text-gray-400">—</td>
                      <td className="px-5 py-4">
                        <div className="w-10 h-10 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-5 py-4 font-extrabold text-gray-900" colSpan={2}>
                        Shipping &amp; Delivery Method
                      </td>
                      <td className="px-5 py-4 text-center font-extrabold text-gray-950">1</td>
                      <td className="px-5 py-4 text-right">
                        {convertToLocale({ amount: order.shipping_total, currency_code: "aud" })}
                      </td>
                      <td className="px-5 py-4 text-right">A$0.00</td>
                      <td className="px-5 py-4 text-right">A$0.00</td>
                      <td className="px-5 py-4 text-right font-extrabold text-gray-900">
                        {convertToLocale({ amount: order.shipping_total, currency_code: "aud" })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Order Totals Summary */}
              <div className="bg-gray-50/50 p-6 border-t border-gray-150 flex flex-col items-end gap-2.5 text-xs text-gray-600 font-bold select-none text-right">
                <div className="flex justify-between w-64">
                  <span>Subtotal ({itemsList.length} items)</span>
                  <span className="text-gray-900 font-extrabold">
                    {convertToLocale({ amount: order.subtotal, currency_code: "aud" })}
                  </span>
                </div>
                {order.shipping_protection && (
                  <div className="flex justify-between w-64">
                    <span>Shipping Protection</span>
                    <span className="text-gray-900 font-extrabold">A$6.50</span>
                  </div>
                )}
                <div className="flex justify-between w-64 border-b border-gray-150 pb-2.5">
                  <span>Shipping Cost</span>
                  <span className="text-gray-900 font-extrabold">
                    {Number(order.shipping_total) === 0 ? "FREE" : convertToLocale({ amount: order.shipping_total, currency_code: "aud" })}
                  </span>
                </div>
                <div className="flex justify-between w-64 text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-[#db2777] text-base font-black">
                    {convertToLocale({ amount: order.total, currency_code: "aud" })}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar: tracking, invoice, notes */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Order Actions Dropdown */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">Order Actions</h4>
              <div className="space-y-3">
                <select className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all cursor-pointer">
                  <option>Choose An Action...</option>
                  <option>Resend Order Invoice</option>
                  <option>Send Tracking Notification</option>
                  <option>Flag Order for Fraud</option>
                  <option>Cancel Order & Refund</option>
                </select>
                <button
                  type="button"
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Note History Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Note History</h4>
              
              {/* Past notes */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {(!order.private_notes || order.private_notes.length === 0) ? (
                  <p className="text-[10px] text-gray-400 font-bold italic">No notes recorded for this order.</p>
                ) : (
                  order.private_notes.map((note: any, nIdx: number) => (
                    <div key={note.id || nIdx} className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-[10px] font-semibold text-gray-650">
                      <p className="text-gray-900 leading-snug">{note.text}</p>
                      <span className="text-[8px] text-gray-400 font-bold block mt-1">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <textarea
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="Add a private note..."
                  rows={3}
                  className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all resize-none"
                />
                <button
                  onClick={async () => {
                    await addOrderPrivateNote(order.id, privateNote)
                    setPrivateNote("")
                  }}
                  disabled={!privateNote.trim()}
                  className="w-full bg-[#db2777] hover:bg-[#c0155a] disabled:opacity-50 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-pink-600/10"
                >
                  Add Private Note
                </button>
              </div>
            </div>

            {/* Create PDF Invoice Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">Create PDF</h4>
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                <FileText className="w-4 h-4 text-[#db2777]" /> PDF Invoice
              </button>
            </div>

            {/* Shipment Tracking Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs space-y-3.5">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Shipment Tracking</h4>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Provider</label>
                <input
                  type="text"
                  value={trackingProvider}
                  onChange={(e) => setTrackingProvider(e.target.value)}
                  placeholder="Provider Name (e.g. AusPost)"
                  className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking No"
                  className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Tracking Link</label>
                <input
                  type="text"
                  value={trackingLink}
                  onChange={(e) => setTrackingLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs font-semibold bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:border-[#db2777] transition-all"
                />
              </div>
              <button
                onClick={() => updateOrderTracking(order.id, trackingProvider, trackingNumber, trackingLink)}
                disabled={updatingOrderTracking === order.id}
                className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {updatingOrderTracking === order.id ? "Updating..." : "Update Shipment"}
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // Calculation of orders KPI cards summary
  const totalCount = orders.length
  const pendingCount = orders.filter(o => o.status === "pending").length
  const processingCount = orders.filter(o => o.status === "processing").length
  const deliveredCount = orders.filter(o => o.status === "delivered").length
  const totalRevenue = orders.reduce((sum, o) => o.status !== "cancelled" ? sum + Number(o.total || 0) : sum, 0)

  // List filter logic
  const filteredOrders = orders.filter((order) => {
    if (orderFilter !== "All" && order.status?.toLowerCase() !== orderFilter.toLowerCase()) {
      return false
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim()
      const orderNum = (order.order_number || "").toLowerCase()
      const email = (order.email || "").toLowerCase()
      const name = `${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}`.toLowerCase()
      return orderNum.includes(q) || email.includes(q) || name.includes(q)
    }
    return true
  })

  return (
    <div className="space-y-6 text-left">
      {/* Header Row */}
      <div>
        <h1 className="text-xl font-black text-gray-950 tracking-tight">Orders</h1>
      </div>

      {/* Summary KPI cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-left shadow-xs">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Total</span>
          <span className="block text-2xl font-black text-gray-950 mt-1">{totalCount}</span>
        </div>
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-left shadow-xs">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider text-amber-500">Pending</span>
          <span className="block text-2xl font-black text-amber-500 mt-1">{pendingCount}</span>
        </div>
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-left shadow-xs">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider text-indigo-500">Processing</span>
          <span className="block text-2xl font-black text-indigo-500 mt-1">{processingCount}</span>
        </div>
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-left shadow-xs">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider text-emerald-500">Delivered</span>
          <span className="block text-2xl font-black text-emerald-500 mt-1">{deliveredCount}</span>
        </div>
        <div className="bg-white border border-gray-150 rounded-2xl p-4 text-left shadow-xs col-span-2 sm:col-span-1">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider text-[#db2777]">Revenue</span>
          <span className="block text-2xl font-black text-[#db2777] mt-1 truncate">
            {convertToLocale({ amount: totalRevenue, currency_code: "aud" })}
          </span>
        </div>
      </div>

      {/* Filter Tab buttons & Search row */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-3.5">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#db2777] focus:outline-none transition-colors"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar select-none">
            {["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => {
              const isActive = orderFilter === tab
              return (
                <button
                  key={tab}
                  onClick={() => setOrderFilter(tab)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    isActive
                      ? "bg-[#db2777] border-[#db2777] text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-55/40 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Orders list table container */}
      {ordersLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-150 rounded-2xl gap-3">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          <p className="text-xs text-gray-400 font-bold">Loading orders database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-xs">
          <h3 className="text-sm font-black text-gray-900 mb-1">No orders found</h3>
          <p className="text-xs text-gray-550">Orders matching your active filters could not be found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left animate-fade-in-top">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-150 text-[10px] font-black text-gray-400 uppercase tracking-wider select-none">
                  <th className="px-5 py-4 w-6"><input type="checkbox" className="rounded border-gray-300 focus:ring-[#db2777] accent-[#db2777]" /></th>
                  <th className="px-5 py-4">Order #</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Store</th>
                  <th className="px-5 py-4">Products</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Platform</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {filteredOrders.map((order) => {
                  const items = order.items || []
                  const sAddr = order.shipping_address || {}
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-5 py-4"><input type="checkbox" className="rounded border-gray-300 focus:ring-[#db2777] accent-[#db2777]" /></td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="font-extrabold text-[#db2777] hover:underline cursor-pointer block text-xs tracking-tight"
                        >
                          #{order.order_number || order.id.slice(0, 8)}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-gray-950 block truncate max-w-[150px]">{sAddr.first_name || ""} {sAddr.last_name || "Guest Customer"}</span>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{order.email}</span>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-500">Testing</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                          <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            <img
                              src={items[0]?.thumbnail || "/assets/products/bpc-157.png"}
                              alt={items[0]?.title}
                              className="max-w-full max-h-full object-cover"
                            />
                          </div>
                          <span className="truncate">{items[0]?.title || "Product"}</span>
                          {items.length > 1 && (
                            <span className="bg-gray-100 text-gray-500 font-bold text-[9px] px-1.5 py-0.5 rounded-md flex-shrink-0">
                              +{items.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          order.status === "delivered"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : order.status === "cancelled"
                            ? "bg-rose-50 border-rose-100 text-rose-700"
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          order.payment_status === "paid"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          {order.payment_status === "paid" ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Web</span>
                      </td>
                      <td className="px-5 py-4 font-extrabold text-gray-950">
                        {convertToLocale({ amount: order.total, currency_code: "aud" })}
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-bold">
                        {new Date(order.created_at).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrderId(order.id)}
                            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#db2777] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                            title="Print"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
