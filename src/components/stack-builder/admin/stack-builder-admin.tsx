"use client"

import React, { useState, useEffect } from "react"
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  X,
  Search,
  Package,
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
  variants: { id: string; title: string }[]
}

const ICON_OPTIONS = [
  "Heart",
  "Brain",
  "Zap",
  "Dumbbell",
  "Target",
  "Shield",
  "Moon",
  "Sparkles",
  "Flame",
  "Smile",
  "Award",
  "Activity",
  "AlertCircle",
  "Hourglass",
]

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

  // Product search
  const [productSearch, setProductSearch] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)

  // Fetch goals from backend
  useEffect(() => {
    fetchGoals()
  }, [])

  async function fetchGoals() {
    try {
      setLoading(true)
      const res = await fetch(`${BACKEND_URL}/admin/recommendations`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        const data = await res.json()
        setGoals(data.goals || [])
      } else {
        setError("Failed to fetch goals. Is the backend running?")
      }
    } catch (err) {
      setError(
        "Cannot connect to backend. Make sure the Medusa server is running at " +
          BACKEND_URL
      )
    } finally {
      setLoading(false)
    }
  }

  async function searchProducts(query: string) {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }
    try {
      setSearching(true)
      const res = await fetch(
        `${BACKEND_URL}/admin/products?q=${encodeURIComponent(query)}&limit=10`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.products || [])
      }
    } catch (err) {
      console.error("Product search failed:", err)
    } finally {
      setSearching(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      setError(null)

      const url = editingGoal
        ? `${BACKEND_URL}/admin/recommendations/${editingGoal.id}`
        : `${BACKEND_URL}/admin/recommendations`

      const method = "POST"

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSuccess(editingGoal ? "Goal updated!" : "Goal created!")
        setTimeout(() => setSuccess(null), 3000)
        resetForm()
        fetchGoals()
      } else {
        const data = await res.json()
        setError(data.message || "Failed to save goal")
      }
    } catch (err) {
      setError("Failed to save. Check backend connection.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this goal?")) return

    try {
      const res = await fetch(`${BACKEND_URL}/admin/recommendations/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        setSuccess("Goal deleted!")
        setTimeout(() => setSuccess(null), 3000)
        fetchGoals()
      }
    } catch (err) {
      setError("Failed to delete goal")
    }
  }

  function resetForm() {
    setFormData({ icon: "Heart", goal_name: "", description: "", product_ids: [] })
    setEditingGoal(null)
    setShowForm(false)
    setProductSearch("")
    setSearchResults([])
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

  function addProductId(productId: string) {
    if (!formData.product_ids.includes(productId)) {
      setFormData((prev) => ({
        ...prev,
        product_ids: [...prev.product_ids, productId],
      }))
    }
  }

  function removeProductId(productId: string) {
    setFormData((prev) => ({
      ...prev,
      product_ids: prev.product_ids.filter((id) => id !== productId),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stack Builder — Goal Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage quiz goals. Assign real products to each goal.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
            ✓ {success}
          </div>
        )}

        {/* Goal Form Modal */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingGoal ? "Edit Goal" : "New Goal"}
              </h2>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid gap-4">
              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Goal Name)
                </label>
                <input
                  type="text"
                  value={formData.goal_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      goal_name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Cardiovascular Health"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="e.g., Support heart function, circulation, and overall cardiovascular wellness."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Products ({formData.product_ids.length} assigned)
                </label>

                {/* Added products */}
                {formData.product_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.product_ids.map((pid) => (
                      <span
                        key={pid}
                        className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2 py-1 rounded-full"
                      >
                        <Package className="w-3 h-3" />
                        {pid.slice(0, 20)}...
                        <button
                          onClick={() => removeProductId(pid)}
                          className="ml-0.5 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Product search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      searchProducts(e.target.value)
                    }}
                    placeholder="Search products to add..."
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProductId(product.id)}
                        disabled={formData.product_ids.includes(product.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-left border-b border-gray-50 last:border-0"
                      >
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.id}
                          </p>
                        </div>
                        {formData.product_ids.includes(product.id) && (
                          <span className="ml-auto text-xs text-emerald-600">
                            Added
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving || !formData.goal_name}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingGoal ? "Update Goal" : "Create Goal"}
              </button>
            </div>
          </div>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No goals created yet. Click "Add Goal" to create your first quiz
              option.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-500">
                      {goal.icon}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {goal.goal_name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">{goal.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {(goal.product_ids || []).length} products assigned
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(goal)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
