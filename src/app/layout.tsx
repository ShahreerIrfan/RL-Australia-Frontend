import { getBaseURL } from "@lib/util/env"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "RL Australia | Premium Research Peptides",
    template: "%s | RL Australia",
  },
  description:
    "Australia's trusted supplier of high-purity research peptides. Third-party tested, COA verified, and shipped discreetly Australia-wide.",
  keywords: [
    "peptides",
    "research peptides",
    "BPC-157",
    "TB-500",
    "Australia",
    "peptide supplier",
  ],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-slate-900" suppressHydrationWarning>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
