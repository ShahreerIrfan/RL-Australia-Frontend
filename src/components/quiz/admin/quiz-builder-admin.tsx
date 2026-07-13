"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Plus, Trash2, Save, Loader2, X, Search, Package, Check, Pencil, ArrowLeft, HelpCircle, ChevronRight
} from "lucide-react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface QuizOption {
  id: string
  option_text: string
  product_ids: string[]
}

interface QuizQuestion {
  id: string
  question_text: string
  order_number: number
  image_url: string | null
  options: QuizOption[]
}

interface Product {
  id: string
  title: string
  thumbnail: string | null
}

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

export default function QuizBuilderAdmin() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Editor form state
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    question_text: "",
    order_number: 0,
    image_url: "",
    options: [] as QuizOption[],
  })

  // Active option index for product selection dropdown
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null)
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchQuizQuestions()
    fetchAllProducts()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveOptionIndex(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function fetchQuizQuestions() {
    try {
      setLoading(true)
      const res = await adminFetch(`${BACKEND_URL}/store/quiz`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data.questions || [])
        setError(null)
      } else {
        setError(`Failed to load quiz questions (${res.status}).`)
      }
    } catch (err) {
      setError("Cannot connect to backend.")
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
      console.error(err)
    } finally {
      setProductsLoading(false)
    }
  }

  function startCreate() {
    setEditingQuestion(null)
    setFormData({
      question_text: "",
      order_number: questions.length + 1,
      image_url: "",
      options: [
        { id: `opt_${Date.now()}_1`, option_text: "Option 1", product_ids: [] }
      ]
    })
    setShowForm(true)
  }

  function startEdit(question: QuizQuestion) {
    setEditingQuestion(question)
    setFormData({
      question_text: question.question_text,
      order_number: question.order_number,
      image_url: question.image_url || "",
      options: question.options.map(opt => ({ ...opt })) || [],
    })
    setShowForm(true)
  }

  function handleAddOption() {
    const newId = `opt_${Date.now()}_${formData.options.length + 1}`
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { id: newId, option_text: `Option ${prev.options.length + 1}`, product_ids: [] }]
    }))
  }

  function handleRemoveOption(idx: number) {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx)
    }))
    if (activeOptionIndex === idx) {
      setActiveOptionIndex(null)
    }
  }

  function handleOptionTextChange(idx: number, text: string) {
    setFormData(prev => {
      const updated = [...prev.options]
      updated[idx].option_text = text
      return { ...prev, options: updated }
    })
  }

  function toggleProductForOption(optionIdx: number, productId: string) {
    setFormData(prev => {
      const updatedOptions = [...prev.options]
      const currentIds = updatedOptions[optionIdx].product_ids || []
      
      if (currentIds.includes(productId)) {
        updatedOptions[optionIdx].product_ids = currentIds.filter(id => id !== productId)
      } else {
        updatedOptions[optionIdx].product_ids = [...currentIds, productId]
      }
      return { ...prev, options: updatedOptions }
    })
  }

  async function handleSave() {
    if (!formData.question_text) {
      alert("Question text is required.")
      return
    }
    try {
      setSaving(true)
      setError(null)

      const url = editingQuestion
        ? `${BACKEND_URL}/store/quiz/${editingQuestion.id}`
        : `${BACKEND_URL}/store/quiz`

      const res = await adminFetch(url, {
        method: "POST",
        body: JSON.stringify({
          question_text: formData.question_text,
          order_number: Number(formData.order_number),
          image_url: formData.image_url || null,
          options: formData.options,
        }),
      })

      if (res.ok) {
        setSuccess(editingQuestion ? "Quiz question updated!" : "Quiz question created!")
        setTimeout(() => setSuccess(null), 3000)
        setShowForm(false)
        fetchQuizQuestions()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || "Failed to save question.")
      }
    } catch (err) {
      setError("Failed to save. Check backend connection.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this question?")) return
    try {
      const res = await adminFetch(`${BACKEND_URL}/store/quiz/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setSuccess("Deleted successfully.")
        setTimeout(() => setSuccess(null), 3000)
        fetchQuizQuestions()
      } else {
        setError("Failed to delete.")
      }
    } catch (err) {
      setError("Failed to delete.")
    }
  }

  return (
    <div className="space-y-6 text-left max-w-6xl animate-fade-in">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight uppercase">Quiz Configuration</h1>
              <p className="text-xs text-gray-500">Configure quiz questions, options, and recommended product associations</p>
            </div>
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 bg-[#047857] hover:bg-[#035f43] text-white px-4 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          {success && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold">
              {success}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#047857]" />
              <span className="text-xs font-bold uppercase tracking-wider">Loading quiz questions...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center text-gray-400">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-bold">No quiz questions configured yet.</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">Configure your biological sex, activity level, or primary focus questions here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                  {/* Question Image Preview */}
                  <div className="w-full md:w-36 h-28 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {q.image_url ? (
                      <img src={q.image_url} alt="Question Graphic" className="w-full h-full object-cover" />
                    ) : (
                      <HelpCircle className="w-8 h-8 text-gray-300" />
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-105 border border-gray-200 text-[10px] font-black text-gray-500 uppercase tracking-wide mr-2">
                          Q#{q.order_number}
                        </span>
                        <h3 className="text-base font-extrabold text-gray-950 inline-block leading-snug">{q.question_text}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(q)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-colors"
                          title="Edit Question"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center text-rose-600 hover:text-rose-700 transition-colors"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="border-t border-gray-100 pt-3">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Configure Answers & Recommendations:</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {q.options?.map((opt, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 flex flex-col gap-1 items-start text-xs max-w-xs">
                            <span className="font-extrabold text-gray-800">{opt.option_text}</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {opt.product_ids?.length > 0 ? (
                                opt.product_ids.map(pId => {
                                  const prod = allProducts.find(p => p.id === pId)
                                  return (
                                    <span key={pId} className="inline-flex items-center bg-sky-50 text-sky-700 border border-sky-100 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                      {prod?.title || "Product"}
                                    </span>
                                  )
                                })
                              ) : (
                                <span className="text-[9px] text-gray-400 italic">No recommendations</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Back breadcrumb */}
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Config
          </button>

          {/* Form container */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm max-w-4xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-gray-950 uppercase tracking-tight">
                {editingQuestion ? "Edit Quiz Question" : "Add New Quiz Question"}
              </h2>
              <p className="text-xs text-gray-500">Define the question text, ordering index, custom graphic, and mapped answers</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Question Text *</label>
                  <input
                    type="text"
                    required
                    value={formData.question_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-all"
                    placeholder="e.g. What is your primary focus?"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Order Number</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.order_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_number: Number(e.target.value) }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">Graphic Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-[#047857] focus:outline-none transition-all"
                  placeholder="https://images.unsplash.com/... or left empty"
                />
              </div>

              {/* Answers & Recommendations Config */}
              <div className="border-t border-gray-150 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-950">Answers / Options Config</h3>
                    <p className="text-[10px] text-gray-450 font-medium -mt-0.5">Create option choices and choose which products to suggest when selected</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Option Choice
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.options.map((opt, idx) => (
                    <div key={opt.id || idx} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center p-3 rounded-xl bg-gray-50 border border-gray-150">
                      
                      {/* Option Text Input */}
                      <div className="flex-1">
                        <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Answer / Option Text</label>
                        <input
                          type="text"
                          required
                          value={opt.option_text}
                          onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-sky-500"
                          placeholder="e.g. Cardiovascular"
                        />
                      </div>

                      {/* Associated Products Multi-Select Dropdown */}
                      <div className="w-full md:w-80 relative" ref={activeOptionIndex === idx ? dropdownRef : null}>
                        <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Recommend Product(s)</label>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveOptionIndex(activeOptionIndex === idx ? null : idx)
                            setProductSearchQuery("")
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-left text-gray-650 flex items-center justify-between focus:outline-none min-h-[32px] cursor-pointer"
                        >
                          <span className="truncate">
                            {opt.product_ids?.length > 0
                              ? `${opt.product_ids.length} selected`
                              : "No recommendations"}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${activeOptionIndex === idx ? "rotate-95" : ""}`} />
                        </button>

                        {/* Dropdown Container */}
                        {activeOptionIndex === idx && (
                          <div className="absolute right-0 z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-3 space-y-2 text-left">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search products..."
                                value={productSearchQuery}
                                onChange={(e) => setProductSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1 text-xs focus:bg-white focus:outline-none"
                              />
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-1">
                              {allProducts
                                .filter(p => p.title.toLowerCase().includes(productSearchQuery.toLowerCase()))
                                .map(product => {
                                  const isSelected = opt.product_ids?.includes(product.id)
                                  return (
                                    <button
                                      key={product.id}
                                      type="button"
                                      onClick={() => toggleProductForOption(idx, product.id)}
                                      className="w-full flex items-center justify-between text-left text-[11px] font-semibold px-2 py-1.5 hover:bg-emerald-50/50 rounded-lg transition-colors"
                                    >
                                      <span className="truncate max-w-[200px]">{product.title}</span>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                    </button>
                                  )
                                })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delete Option button */}
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 hover:text-rose-700 w-8 h-8 rounded-lg flex items-center justify-center transition-colors self-end"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-gray-200 text-xs font-bold text-gray-500 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-1.5 bg-[#047857] hover:bg-[#035f43] disabled:opacity-65 text-white px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Question"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
