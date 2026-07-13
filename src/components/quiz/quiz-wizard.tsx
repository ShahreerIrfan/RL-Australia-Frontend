"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, ArrowRight, Loader2, Check, ShoppingCart, HelpCircle, RefreshCw, Sparkles, AlertCircle
} from "lucide-react"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test"

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
  handle: string
  thumbnail: string | null
  description: string
  variants: any[]
}

export default function QuizWizard() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({}) // question_id -> option_id
  
  // Results states
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`${BACKEND_URL}/store/quiz`, {
          headers: {
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
        })
        if (res.ok) {
          const data = await res.json()
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions)
          }
        }
      } catch (e) {
        console.error("Failed to load quiz questions:", e)
      }
      setLoading(false)
    }
    fetchQuiz()
  }, [])

  // Retrieve products for recommendations on submit
  async function submitQuiz() {
    setIsSubmitted(true)
    setLoadingProducts(true)
    
    // Aggregate product IDs from selected options
    const productIds: string[] = []
    questions.forEach(q => {
      const selectedOptId = answers[q.id]
      if (selectedOptId) {
        const opt = q.options.find(o => o.id === selectedOptId)
        if (opt && opt.product_ids) {
          opt.product_ids.forEach(pId => {
            if (!productIds.includes(pId)) {
              productIds.push(pId)
            }
          })
        }
      }
    })

    if (productIds.length > 0) {
      try {
        const res = await fetch(`${BACKEND_URL}/store/quiz/recommendations?product_ids=${productIds.join(",")}`, {
          headers: {
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
        })
        if (res.ok) {
          const data = await res.json()
          setRecommendedProducts(data.products || [])
        }
      } catch (e) {
        console.error("Failed to fetch product recommendations:", e)
      }
    }
    setLoadingProducts(false)
  }

  async function handleAddToCart() {
    if (recommendedProducts.length === 0) return
    setAddingToCart(true)
    try {
      let cartId = typeof window !== "undefined" ? localStorage.getItem("rl_cart_id") : null

      if (!cartId) {
        const createRes = await fetch(`${BACKEND_URL}/store/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ region_id: "reg_au" }),
        })
        if (createRes.ok) {
          const createData = await createRes.json()
          cartId = createData.cart.id
          if (typeof window !== "undefined") {
            localStorage.setItem("rl_cart_id", cartId!)
            document.cookie = `_medusa_cart_id=${cartId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          }
        }
      }

      for (const p of recommendedProducts) {
        const variantId = p.variants?.[0]?.id || `var_${p.id}`
        await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variant_id: variantId, quantity: 1 }),
        })
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"))
      }
      setCartAdded(true)
      setTimeout(() => setCartAdded(false), 4000)
    } catch (e) {
      console.error(e)
    } finally {
      setAddingToCart(false)
    }
  }

  function handleSelectOption(questionId: string, optionId: string) {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  function retakeQuiz() {
    setAnswers({})
    setCurrentStep(0)
    setIsSubmitted(false)
    setRecommendedProducts([])
    setCartAdded(false)
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
        <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Loading wellness survey...</span>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <h2 className="text-xl font-black text-gray-900 uppercase">Quiz Unavailable</h2>
        <p className="text-gray-500 max-w-md">The admin has not configured any questions yet. Please check back later!</p>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Quiz Submitted Successfully
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-tight">Your Customized Stack</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2">Based on your primary health focus and selections, we recommend the following stack:</p>
          </div>

          {loadingProducts ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Analyzing selections...</span>
            </div>
          ) : recommendedProducts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 max-w-md mx-auto shadow-sm">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-sm font-bold text-gray-800">No matching stack found</h3>
              <p className="text-xs text-gray-500 mt-1">Please try again with a different health focus.</p>
              <button onClick={retakeQuiz} className="mt-5 w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold py-2.5 rounded-xl uppercase tracking-wider transition-all">
                Retake Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recommendedProducts.map((product) => {
                  const price = product.variants?.[0]?.calculated_price?.calculated_amount || 0

                  return (
                    <div key={product.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between">
                      <div>
                        {/* Thumbnail */}
                        <div className="w-full h-40 bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 flex items-center justify-center">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <HelpCircle className="w-10 h-10 text-gray-200" />
                          )}
                        </div>
                        <h3 className="font-extrabold text-gray-900 leading-snug">{product.title}</h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">
                          {product.variants?.[0]?.title || "Standard"}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-base font-black text-emerald-700">${Number(price).toFixed(2)}</span>
                        <Link 
                          href={`/products/${product.handle}`}
                          className="text-[10px] font-black text-sky-600 hover:text-sky-700 uppercase tracking-wider"
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Bar */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
                <div className="text-left">
                  <h3 className="text-sm font-black text-gray-950 uppercase">Ready to start?</h3>
                  <p className="text-xs text-gray-450 mt-0.5">Add all recommended products to your cart with one click.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={retakeQuiz}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 px-5 py-3 text-xs font-bold rounded-xl uppercase tracking-wider transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retake
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#02a5e9] hover:bg-sky-600 disabled:opacity-65 text-white px-6 py-3 text-xs font-bold rounded-xl uppercase tracking-wider transition-all shadow-md shadow-sky-600/10 cursor-pointer border-b-2 border-sky-700"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Adding...
                      </>
                    ) : cartAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add Stack to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep]
  const selectedOptionId = answers[currentQuestion.id]
  const isFocusQuestion = currentQuestion.options.length > 5 // e.g. Question 4 with 16 options!

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 bg-white rounded-3xl border border-gray-200 p-6 sm:p-12 shadow-sm relative overflow-hidden items-center">
        
        {/* Left Column - Graphic/Image Preview */}
        <div className="w-full h-[250px] sm:h-[400px] bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative shadow-inner">
          {currentQuestion.image_url ? (
            <img 
              src={currentQuestion.image_url} 
              alt={currentQuestion.question_text} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <HelpCircle className="w-16 h-16 text-gray-200" />
            </div>
          )}
        </div>

        {/* Right Column - Survey Options & Navigation */}
        <div className="flex flex-col justify-between min-h-[350px] sm:min-h-[400px] text-left">
          <div className="space-y-6">
            
            {/* Step Progress Header */}
            <div className="flex items-center gap-4">
              {/* Progress Dots */}
              <div className="flex gap-1.5">
                {questions.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentStep 
                        ? "bg-gray-800 scale-110" 
                        : idx < currentStep 
                          ? "bg-gray-800/90" 
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">
                Question #{currentStep + 1}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight leading-tight">
              {currentQuestion.question_text}
            </h2>

            {/* Option Choices Grid */}
            <div className={isFocusQuestion ? "grid grid-cols-2 gap-3" : "space-y-3"}>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`w-full text-left px-5 py-3.5 sm:py-4.5 rounded-xl border text-xs sm:text-sm font-extrabold uppercase tracking-wide cursor-pointer transition-all select-none ${
                      isSelected
                        ? "bg-gray-900 border-gray-900 text-white shadow-md"
                        : "bg-white border-gray-250 text-gray-800 hover:border-gray-900"
                    }`}
                  >
                    {opt.option_text}
                  </button>
                )
              })}
            </div>

          </div>

          {/* Navigation Controls (Back & Next) */}
          <div className="flex items-center gap-3 pt-8 border-t border-gray-100 mt-6 justify-between">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 0}
              className={`flex items-center justify-center gap-1.5 px-6 py-3.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all select-none ${
                currentStep === 0
                  ? "opacity-35 cursor-not-allowed text-gray-400 border border-gray-200"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!selectedOptionId}
                className={`flex items-center justify-center gap-1.5 px-7 py-3.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all select-none border-b-2 ${
                  !selectedOptionId
                    ? "opacity-45 cursor-not-allowed bg-gray-100 text-gray-405 border-gray-200"
                    : "bg-[#02a5e9] hover:bg-sky-600 text-white border-sky-700 cursor-pointer shadow-md shadow-sky-600/10"
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                disabled={!selectedOptionId}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all select-none border-b-2 ${
                  !selectedOptionId
                    ? "opacity-45 cursor-not-allowed bg-gray-100 text-gray-405 border-gray-200"
                    : "bg-[#02a5e9] hover:bg-sky-600 text-white border-sky-700 cursor-pointer shadow-md shadow-sky-600/10"
                }`}
              >
                View Results
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
