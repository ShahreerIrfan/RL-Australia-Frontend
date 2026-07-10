"use client"

import React, { useState, useEffect } from "react"
import { Save, Loader2, Truck, Settings } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function StoreSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [freeShippingThreshold, setFreeShippingThreshold] = useState("200")

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch(`${BACKEND_URL}/store/settings`)
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || {})
        if (data.settings?.free_shipping_threshold) {
          setFreeShippingThreshold(data.settings.free_shipping_threshold)
        }
      }
    } catch (err) {
      setError("Cannot connect to backend")
    } finally {
      setLoading(false)
    }
  }

  async function saveSetting(key: string, value: string) {
    try {
      setSaving(true)
      setError(null)
      const res = await fetch(`${BACKEND_URL}/store/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })
      if (res.ok) {
        setSuccess("Saved!")
        setTimeout(() => setSuccess(null), 2000)
        fetchSettings()
      } else {
        setError("Failed to save")
      }
    } catch (err) {
      setError("Failed to save. Check backend.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Store Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage shipping thresholds, delivery settings, and other store configurations.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">{error}</div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-medium">✓ {success}</div>
      )}

      {/* Free Shipping Threshold */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Truck className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Free Shipping Threshold</h3>
            <p className="text-[10px] text-gray-450 -mt-0.5">Minimum cart value for free delivery</p>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Amount ($AUD)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-gray-400 font-semibold">$</span>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">Currently: ${settings.free_shipping_threshold || "200"}</p>
          </div>
          <button
            onClick={() => saveSetting("free_shipping_threshold", freeShippingThreshold)}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#047857] hover:bg-[#035f43] disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
