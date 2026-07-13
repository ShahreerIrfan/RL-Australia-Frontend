import { Metadata } from "next"
import QuizWizard from "@components/quiz/quiz-wizard"

export const metadata: Metadata = {
  title: "Stack Builder | Take the Wellness Quiz",
  description:
    "Take our interactive wellness survey. Match with the perfect peptide and supplement stack curated for your health goals.",
}

export default function StackBuilderPage() {
  return <QuizWizard />
}
