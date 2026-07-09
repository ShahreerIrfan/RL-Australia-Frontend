import { retrieveCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"

export default async function AccountPageLayout({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    redirect(`/${countryCode}/login`)
  }

  if (customer.role === "admin") {
    redirect(`/${countryCode}/admin-dashboard`)
  } else {
    redirect(`/${countryCode}/customer-dashboard`)
  }
}
