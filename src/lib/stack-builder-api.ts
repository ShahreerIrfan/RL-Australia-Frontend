/**
 * Stack Builder API Client
 * 
 * Fetches goals and their recommended products from the Medusa backend.
 * Falls back to static data if the backend is unreachable.
 */

import { goalStacks as staticGoalStacks } from "./stack-builder-data"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test"

export interface RecommendationProduct {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
  variants: {
    id: string
    title: string
    sku: string | null
    calculated_price?: {
      calculated_amount: number
      currency_code: string
    }
  }[]
}

export interface RecommendationGoal {
  id: string
  icon: string
  goal_name: string
  description: string
  products: RecommendationProduct[]
}

/**
 * Fetch stack recommendations from the backend API.
 * Returns goals with their recommended products fully populated.
 */
export async function fetchStackRecommendations(): Promise<RecommendationGoal[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/recommendations`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    return data.recommendations || []
  } catch (error) {
    console.warn("[Stack Builder] Failed to fetch from API, using static data:", error)
    return []
  }
}

/**
 * Get stack goals — tries API first, falls back to static data.
 * This is used on the frontend to render the goal selector and product recommendations.
 */
export async function getStackGoals() {
  const apiGoals = await fetchStackRecommendations()

  if (apiGoals.length > 0) {
    return { source: "api" as const, goals: apiGoals }
  }

  // Fallback to static data
  return { source: "static" as const, goals: staticGoalStacks }
}
