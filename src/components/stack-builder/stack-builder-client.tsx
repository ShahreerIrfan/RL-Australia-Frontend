"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import GoalSelector from "./goal-selector"
import StackRecommendation from "./stack-recommendation"
import ManualBuilder from "./manual-builder"
import { goalStacks, GoalStack, StackProduct, allProducts } from "@lib/stack-builder-data"
import { ArrowLeft, Sparkles, Wrench, Loader2 } from "lucide-react"

type BuilderMode = "quiz" | "manual"
type QuizStep = "select-goal" | "view-stack"

interface ApiGoal {
  id: string
  icon: string
  goal_name: string
  description: string
  products: any[]
}

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test"

export default function StackBuilderClient() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<BuilderMode>("quiz")
  const [quizStep, setQuizStep] = useState<QuizStep>("select-goal")
  const [selectedGoal, setSelectedGoal] = useState<GoalStack | null>(null)
  const [stackProducts, setStackProducts] = useState<StackProduct[]>([])
  const [cartMessage, setCartMessage] = useState<string | null>(null)

  // API-based goals
  const [apiGoals, setApiGoals] = useState<ApiGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"api" | "static">("static")

  // Fetch goals from backend API
  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch(`${BACKEND_URL}/store/recommendations`, {
          headers: {
            "x-publishable-api-key": PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          const data = await response.json()
          if (data.recommendations && data.recommendations.length > 0) {
            setApiGoals(data.recommendations)
            setDataSource("api")
          }
        }
      } catch (error) {
        // Backend unavailable, will use static data
        console.warn("[Stack Builder] Backend unavailable, using static data")
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [])

  // Check if a goal was passed via URL (from homepage goal cards)
  useEffect(() => {
    if (loading) return

    const goalParam = searchParams.get("goal")
    if (goalParam) {
      if (dataSource === "api") {
        // Match by goal_name (slug-ified)
        const found = apiGoals.find(
          (g) => g.goal_name.toLowerCase().replace(/\s+/g, "-") === goalParam ||
                 g.id === goalParam
        )
        if (found) {
          selectApiGoal(found)
          return
        }
      }
      // Fallback to static data
      const found = goalStacks.find((g) => g.id === goalParam)
      if (found) {
        setSelectedGoal(found)
        setStackProducts([...found.products])
        setQuizStep("view-stack")
      }
    }
  }, [searchParams, loading, dataSource, apiGoals])

  // Convert API goal to internal format and select it
  const selectApiGoal = (apiGoal: ApiGoal) => {
    const products: StackProduct[] = apiGoal.products.map((p: any) => {
      const variant = p.variants?.[0]
      const price = variant?.calculated_price?.calculated_amount
        ? variant.calculated_price.calculated_amount / 100
        : 0

      return {
        id: p.id,
        name: p.title,
        dosage: variant?.title || "",
        price: price,
        image: p.thumbnail || "/assets/products/asset 6.png",
        role: p.description || "",
        category: "Product",
      }
    })

    const goal: GoalStack = {
      id: apiGoal.id,
      title: apiGoal.goal_name,
      description: apiGoal.description || "",
      icon: apiGoal.icon || "Heart",
      color: "sky",
      products,
    }

    setSelectedGoal(goal)
    setStackProducts([...products])
    setQuizStep("view-stack")
  }

  const handleGoalSelect = (goal: GoalStack) => {
    setSelectedGoal(goal)
    setStackProducts([...goal.products])
    setQuizStep("view-stack")
  }

  const handleApiGoalSelect = (apiGoal: ApiGoal) => {
    selectApiGoal(apiGoal)
  }

  const handleRemoveProduct = (productId: string) => {
    setStackProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const handleAddToCart = () => {
    // TODO: Integrate with Medusa Cart API when backend is connected
    // For now show confirmation
    setCartMessage(
      `Added ${stackProducts.length} item${stackProducts.length > 1 ? "s" : ""} to your cart!`
    )
    setTimeout(() => setCartMessage(null), 4000)
  }

  const handleReset = () => {
    setSelectedGoal(null)
    setStackProducts([])
    setQuizStep("select-goal")
    setCartMessage(null)
  }

  const handleManualAddToCart = (products: StackProduct[]) => {
    setCartMessage(
      `Added ${products.length} item${products.length > 1 ? "s" : ""} to your cart!`
    )
    setTimeout(() => setCartMessage(null), 4000)
  }

  // Convert API goals to GoalStack format for the GoalSelector component
  const getDisplayGoals = (): GoalStack[] => {
    if (dataSource === "api" && apiGoals.length > 0) {
      return apiGoals.map((g) => ({
        id: g.id,
        title: g.goal_name,
        description: g.description || "",
        icon: g.icon || "Heart",
        color: "sky",
        products: g.products.map((p: any) => ({
          id: p.id,
          name: p.title,
          dosage: p.variants?.[0]?.title || "",
          price: p.variants?.[0]?.calculated_price?.calculated_amount
            ? p.variants[0].calculated_price.calculated_amount / 100
            : 0,
          image: p.thumbnail || "/assets/products/asset 6.png",
          role: p.description || "",
          category: "Product",
        })),
      }))
    }
    return goalStacks
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading Stack Builder...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart confirmation toast */}
      {cartMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in-right text-sm font-medium">
          ✓ {cartMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Stack Builder
          </h1>
          <p className="text-sm sm:text-base text-gray-500 text-center mt-1 max-w-lg mx-auto">
            Build the perfect combination of peptides, nootropics, and
            supplements for your goals.
          </p>

          {/* Data source indicator (dev only) */}
          {dataSource === "api" && (
            <p className="text-[10px] text-center text-emerald-600 mt-2">
              ✓ Connected to live product catalog
            </p>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => {
                setMode("quiz")
                handleReset()
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "quiz"
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Goal-Based Quiz
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "manual"
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <Wrench className="w-4 h-4" />
              Build from Scratch
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {mode === "quiz" ? (
          <>
            {quizStep === "select-goal" && (
              <GoalSelector
                goals={getDisplayGoals()}
                onSelect={handleGoalSelect}
              />
            )}
            {quizStep === "view-stack" && selectedGoal && (
              <>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Goals
                </button>
                <StackRecommendation
                  goal={selectedGoal}
                  products={stackProducts}
                  onRemove={handleRemoveProduct}
                  onAddToCart={handleAddToCart}
                  onReset={handleReset}
                />
              </>
            )}
          </>
        ) : (
          <ManualBuilder onAddToCart={handleManualAddToCart} />
        )}
      </div>
    </div>
  )
}
