import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import Nav from "@components/layout/templates/nav"
import Footer from "@components/layout/templates/footer"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "RL Australia | Premium Research Peptides",
  description:
    "Australia's trusted supplier of high-purity research peptides. Third-party tested, COA verified, and shipped discreetly Australia-wide.",
}

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {props.children}
      <Footer />
    </>
  )
}
