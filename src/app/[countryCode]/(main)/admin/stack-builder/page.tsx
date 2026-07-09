import { Metadata } from "next"
import StackBuilderAdmin from "@components/stack-builder/admin/stack-builder-admin"

export const metadata: Metadata = {
  title: "Admin | Stack Builder Goals Management",
  description: "Manage Stack Builder quiz goals and product recommendations.",
}

export default function StackBuilderAdminPage() {
  return <StackBuilderAdmin />
}
