import UnifiedCheckout from "@components/checkout/templates/unified-checkout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  return <UnifiedCheckout />
}
