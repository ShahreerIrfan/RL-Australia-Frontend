import { Metadata } from "next"
import StackBuilderListing from "@components/stack-builder/stack-builder-listing"

export const metadata: Metadata = {
  title: "Stack Builder | Find Your Perfect Stack",
  description:
    "Browse our curated supplement stacks. Choose a goal and discover the best products for your needs.",
}

export default function StackBuilderPage() {
  return <StackBuilderListing />
}
