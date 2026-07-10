"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Plus, Trash2, Save, Loader2, X, Search, Package, Check,
  Heart, Brain, Zap, Dumbbell, Target, Shield, Moon,
  Sparkles, Flame, Smile, Award, Activity, AlertCircle, Hourglass,
} from "lucide-react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface Goal {
  id: string
  icon: string
  goal_name: string
  description: string
  product_ids: string[]
}

interface Product {
  id: string
  title: string
  thumbnail: string | null
}

const ICON_OPTIONS = [
  { name: "Heart", component: Heart },
  { name: "Brain", component: Brain },
  { name: "Zap", component: Zap },
  { name: "Dumbbell", component: Dumbbell },
  { name: "Target", component: Target },
  { name: "Shield", component: Shield },
  { name: "Moon", component: Moon },
  { name: "Sparkles", component: Sparkles },
  { name: "Flame", component: Flame },
  { name: "Smile", component: Smile },
  { name: "Award", component: Award },
  { name: "Activity", component: Activity },
  { name: "AlertCircle", component: AlertCircle },
  { name: "Hourglass", component: Hourglass },
]

const adminFetch = (url: string, init?: RequestInit) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const adminSecret = typeof window !== "undefined" ? (localStorage.getItem("admin_secret") || "") : ""
  return fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      "x-admin-secret": adminSecret || process.env.NEXT_PUBLIC_ADMIN_API_SECRET || "",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
}

export default function StackBuilderAdmin() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    icon: "Heart",
    goal_name: "",
    description: "",
    product_ids: [] as string[],
  })

  // Product dropdown state
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchGoals()
    fetchAllProducts()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function fetchGoals() {
    try {
      setLoading(true)
      const res = await adminFetch(`${BACKEND_URL}/store/recommendations`)
      if (res.ok) {
        const data = await res.json()
        const goalsData = data.goals || data.recommendations || []
        setGoals(goalsData)
        setError(null)
      } else {
        setError(`Failed to load quiz options (${res.status}). Check backend deployment.`)
      }
    } catch (err) {
      setError("Cannot connect to backend at " + BACKEND_URL)
    } finally {
      setLoading(false)
    }
  }

  async function fetchAllProducts() {
    try {
      setProductsLoading(true)
      const res = await adminFetch(`${BACKEND_URL}/store/products?limit=100`)
      if (res.ok) {
        const data = await res.json()
        setAllProducts(data.products || [])
      }
    } catch (err) {
      // silently fail
    } finally {
      setProductsLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.goal_name) return
    try {
      setSaving(true)
      setError(null)

      const url = editingGoal
        ? `${BACKEND_URL}/store/recommendations/${editingGoal.id}`
        : `${BACKEND_URL}/store/recommendations`

      let res = await adminFetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSuccess(editingGoal ? "Quiz option updated!" : "Quiz option created!")
        setTimeout(() => setSuccess(null), 3000)
        resetForm()
        fetchGoals()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || `Failed to save (${res.status}).`)
      }
    } catch (err) {
      setError("Failed to save. Check backend connection.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this quiz option?")) return
    try {
      const res = await adminFetch(`${BACKEND_URL}/store/recommendations/${id}`, { method: "DELETE" })
      if (res.ok) {
        setSuccess("Deleted!")
        setTimeout(() => setSuccess(null), 3000)
        fetchGoals()
      }
    } catch (err) {
      setError("Failed to delete")
    }
  }

  function resetForm() {
    setFormData({ icon: "Heart", goal_name: "", description: "", product_ids: [] })
    setEditingGoal(null)
    setShowForm(false)
    setProductDropdownOpen(false)
    setProductSearchQuery("")
  }

  function startEdit(goal: Goal) {
    setEditingGoal(goal)
    setFormData({
      icon: goal.icon || "Heart",
      goal_name: goal.goal_name,
      description: goal.description || "",
      product_ids: goal.product_ids || [],
    })
    setShowForm(true)
  }

  function toggleProduct(productId: string) {
    setFormData((prev) => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter((id) => id !== productId)
        : [...prev.product_ids, productId],
    }))
  }

  const filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(productSearchQuery.toLowerCase())
  )

  const selectedIcon = ICON_OPTIONS.find((i) => i.name === formData.icon)
  const SelectedIconComponent = selectedIcon?.component || Heart

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
            Stack Builder — Quiz Options
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create quiz options and assign products to each. These appear on the public Stack Builder page.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 bg-[#047857] hover:bg-[#035f43] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Quiz Option
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-medium">
          ✓ {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">
              {editingGoal ? "Edit Quiz Option" : "New Quiz Option"}
            </h2>
            <button onClick={resetForm} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid gap-5">
            {/* Icon select with preview */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Icon</label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <SelectedIconComponent className="w-5 h-5 text-emerald-600" />
                </div>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>{opt.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Title (Goal Name)</label>
              <input
                type="text"
                value={formData.goal_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, goal_name: e.target.value }))}
                placeholder="e.g., Cardiovascular Health"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#047857] focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Support heart function, circulation, and overall cardiovascular wellness."
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:border-[#047857] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Products multi-select dropdown */}
            <div ref={dropdownRef}>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Products ({formData.product_ids.length} selected)
              </label>

              {/* Selected products tags */}
              {formData.product_ids.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.product_ids.map((pid) => {
                    const product = allProducts.find((p) => p.id === pid)
                    return (
                      <span key={pid} className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {product?.thumbnail && (
                          <img src={product.thumbnail} alt="" className="w-4 h-4 rounded object-cover" />
                        )}
                        {product?.title || pid.slice(0, 15) + "..."}
                        <button onClick={() => toggleProduct(pid)} className="hover:text-red-500 ml-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Dropdown trigger */}
              <button
                type="button"
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:border-gray-300 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  {productDropdownOpen ? "Close product list" : "Click to select products..."}
                </span>
                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                  {allProducts.length} available
                </span>
              </button>

              {/* Dropdown panel */}
              {productDropdownOpen && (
                <div className="mt-2 border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
                  {/* Search inside dropdown */}
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-emerald-300"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Product list */}
                  <div className="max-h-64 overflow-y-auto">
                    {productsLoading ? (
                      <div className="p-4 text-center">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 mx-auto" />
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-400">
                        No products found
                      </div>
                    ) : (
                      filteredProducts.map((product) => {
                        const isSelected = formData.product_ids.includes(product.id)
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => toggleProduct(product.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${isSelected ? "bg-emerald-50/50" : ""}`}
                          >
                            {/* Checkbox */}
                            <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>

                            {/* Thumbnail */}
                            {product.thumbnail ? (
                              <img src={product.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Package className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                            )}

                            {/* Product info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800 truncate">{product.title}</p>
                              <p className="text-[10px] text-gray-400 truncate">{product.id}</p>
                            </div>

                            {isSelected && (
                              <span className="text-[10px] font-bold text-emerald-600 flex-shrink-0">✓ Added</span>
                            )}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving || !formData.goal_name}
              className="inline-flex items-center justify-center gap-2 bg-[#047857] hover:bg-[#035f43] disabled:bg-gray-300 text-white px-5 py-3 rounded-xl text-xs font-bold transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingGoal ? "Update Quiz Option" : "Create Quiz Option"}
            </button>
          </div>
        </div>
      )}

      {/* Goals List — hide when editing */}
      {!showForm && (loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : goals.length === 0 && !error ? (
        <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">
            No quiz options created yet.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click &ldquo;Add Quiz Option&rdquo; to create your first one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const GoalIcon = ICON_OPTIONS.find((i) => i.name === goal.icon)?.component || Heart
            return (
              <div key={goal.id} className="bg-white rounded-2xl border border-gray-150 p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <GoalIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{goal.goal_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{goal.description}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                      {(goal.product_ids || []).length} product{(goal.product_ids || []).length !== 1 ? "s" : ""} assigned
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(goal)}
                    className="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
