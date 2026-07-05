import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import Nav from "@components/layout/templates/nav"
import Footer from "@components/layout/templates/footer"
import AnnouncementBar from "@components/home/announcement-bar"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "RL Australia | Premium Research Peptides",
  description:
    "Australia's trusted supplier of high-purity research peptides. Third-party tested, COA verified, and shipped discreetly Australia-wide.",
}

import { retrieveCustomer } from "@lib/data/customer"

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <>
      <AnnouncementBar />
      <Nav customer={customer} />
      {props.children}
      <Footer />
    </>
  )
}
