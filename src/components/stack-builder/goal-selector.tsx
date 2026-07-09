"use client"

import React from "react"
import {
  Heart,
  Brain,
  Dumbbell,
  Zap,
  Shield,
  Moon,
  Target,
  Sparkles,
  Flame,
  Smile,
  Award,
  Activity,
  AlertCircle,
  Hourglass,
} from "lucide-react"
import { goalStacks, GoalStack } from "@lib/stack-builder-data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Brain,
  Dumbbell,
  Zap,
  Shield,
  Moon,
  Target,
  Sparkles,
  Flame,
  Smile,
  Award,
  Activity,
  AlertCircle,
  Hourglass,
}

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  sky: { bg: "bg-sky-50", border: "border-sky-100 hover:border-sky-300", text: "text-sky-700", iconBg: "bg-sky-100" },
  purple: { bg: "bg-purple-50", border: "border-purple-100 hover:border-purple-300", text: "text-purple-700", iconBg: "bg-purple-100" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100 hover:border-emerald-300", text: "text-emerald-700", iconBg: "bg-emerald-100" },
  amber: { bg: "bg-amber-50", border: "border-amber-100 hover:border-amber-300", text: "text-amber-700", iconBg: "bg-amber-100" },
  blue: { bg: "bg-blue-50", border: "border-blue-100 hover:border-blue-300", text: "text-blue-700", iconBg: "bg-blue-100" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-100 hover:border-indigo-300", text: "text-indigo-700", iconBg: "bg-indigo-100" },
  rose: { bg: "bg-rose-50", border: "border-rose-100 hover:border-rose-300", text: "text-rose-700", iconBg: "bg-rose-100" },
  teal: { bg: "bg-teal-50", border: "border-teal-100 hover:border-teal-300", text: "text-teal-700", iconBg: "bg-teal-100" },
  pink: { bg: "bg-pink-50", border: "border-pink-100 hover:border-pink-300", text: "text-pink-700", iconBg: "bg-pink-100" },
  orange: { bg: "bg-orange-50", border: "border-orange-100 hover:border-orange-300", text: "text-orange-700", iconBg: "bg-orange-100" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-100 hover:border-yellow-300", text: "text-yellow-700", iconBg: "bg-yellow-100" },
  red: { bg: "bg-red-50", border: "border-red-100 hover:border-red-300", text: "text-red-700", iconBg: "bg-red-100" },
  violet: { bg: "bg-violet-50", border: "border-violet-100 hover:border-violet-300", text: "text-violet-700", iconBg: "bg-violet-100" },
}

interface Props {
  goals?: GoalStack[]
  onSelect: (goal: GoalStack) => void
}

export default function GoalSelector({ goals, onSelect }: Props) {
  const displayGoals = goals || goalStacks
  return (
    <div>
      {/* Instructions */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          Step 1 of 2
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          What&apos;s your primary goal?
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Select a goal below and we&apos;ll recommend the best combination of
          products to help you achieve it.
        </p>
      </div>

      {/* Goal cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayGoals.map((goal) => {
          const Icon = iconMap[goal.icon] || Heart
          const colors = colorMap[goal.color] || colorMap.sky

          return (
            <button
              key={goal.id}
              onClick={() => onSelect(goal)}
              className={`group text-left p-5 sm:p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.iconBg}`}
                >
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 group-hover:text-gray-800">
                    {goal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {goal.description}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                    {goal.products.length} products recommended →
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
