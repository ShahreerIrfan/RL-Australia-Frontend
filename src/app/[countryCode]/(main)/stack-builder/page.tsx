import { Metadata } from "next"
import StackBuilderClient from "@components/stack-builder/stack-builder-client"

export const metadata: Metadata = {
  title: "Stack Builder | Build Your Perfect Stack",
  description:
    "Take our quick quiz to find your perfect peptide, nootropic, and supplement stack. Choose a goal and get personalized product recommendations.",
}

export default function StackBuilderPage() {
  return <StackBuilderClient />
}
