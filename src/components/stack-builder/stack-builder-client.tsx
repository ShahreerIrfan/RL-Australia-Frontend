"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import GoalSelector from "./goal-selector"
import StackRecommendation from "./stack-recommendation"
import ManualBuilder from "./manual-builder"
import { goalStacks, GoalStack, StackProduct } from "@lib/stack-builder-data"
import { ArrowLeft, Sparkles, Wrench } from "lucide-react"

type BuilderMode = "quiz" | "manual"
type QuizStep = "select-goal" | "view-stack"

export default function StackBuilderClient() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<BuilderMode>("quiz")
  const [quizStep, setQuizStep] = useState<QuizStep>("select-goal")
  const [selectedGoal, setSelectedGoal] = useState<GoalStack | null>(null)
  const [stackProducts, setStackProducts] = useState<StackProduct[]>([])
  const [cartMessage, setCartMessage] = useState<string | null>(null)

  // Check if a goal was passed via URL (from homepage goal cards)
  useEffect(() => {
    const goalParam = searchParams.get("goal")
    if (goalParam) {
      const found = goalStacks.find((g) => g.id === goalParam)
      if (found) {
        setSelectedGoal(found)
        setStackProducts([...found.products])
        setQuizStep("view-stack")
      }
    }
  }, [searchParams])

  const handleGoalSelect = (goal: GoalStack) => {
    setSelectedGoal(goal)
    setStackProducts([...goal.products])
    setQuizStep("view-stack")
  }

  const handleRemoveProduct = (productId: string) => {
    setStackProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const handleAddToCart = () => {
    // In a real implementation, this would call the Medusa cart API
    // For now, show a confirmation message
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
              <GoalSelector onSelect={handleGoalSelect} />
            )}
            {quizStep === "view-stack" && selectedGoal && (
              <>
                {/* Back button */}
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
