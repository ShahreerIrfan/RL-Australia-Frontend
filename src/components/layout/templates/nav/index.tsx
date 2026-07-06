"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, ChevronDown, LogIn, Search, Dna, User, LogOut, LayoutDashboard } from "lucide-react"
import CartDrawer from "@components/layout/components/cart-drawer"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/store",
    submenu: [
      { label: "All Peptides", href: "/store" },
      { label: "Recovery & Healing", href: "/categories/recovery" },
      { label: "Cognitive", href: "/categories/cognitive" },
      { label: "Anti-Aging", href: "/categories/anti-aging" },
      { label: "Muscle Growth", href: "/categories/muscle-growth" },
      { label: "Fat Loss", href: "/categories/fat-loss" },
      { label: "Stacks & Bundles", href: "/categories/stacks" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
]

type NavProps = {
  customer?: any
}

export default function Nav({ customer }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch cart count on mount and on cart updates
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartId = typeof window !== "undefined" ? localStorage.getItem("rl_cart_id") : null
        if (!cartId) return
        const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          const count = data.cart?.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0
          setCartCount(count)
        }
      } catch {}
    }
    fetchCartCount()
    window.addEventListener("cart-updated", fetchCartCount)
    return () => window.removeEventListener("cart-updated", fetchCartCount)
  }, [])

  const openCartDrawer = () => {
    window.dispatchEvent(new Event("open-cart-drawer"))
  }

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-md" : "shadow-sm"} border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout Row 1: Hamburger (left), Logo (center), Cart (right) */}
          <div className="flex lg:hidden items-center justify-between h-14 relative">
            {/* Hamburger button */}
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-650 hover:bg-gray-50 transition-colors"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            {/* Centered Logo on mobile */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 absolute left-1/2 -translate-x-1/2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md border border-white/20">
                <Dna className="w-5.5 h-5.5 text-white animate-pulse" style={{ animationDuration: "4s" }} />
              </div>
              <div className="text-left leading-none">
                <span className="block text-[15px] font-black text-gray-900 tracking-tight uppercase">RL Australia</span>
                <span className="block text-[8px] text-emerald-600 font-extrabold uppercase tracking-[0.15em] mt-0.5">Peptide Research</span>
              </div>
            </Link>

            {/* Cart button */}
            <button
              onClick={openCartDrawer}
              className="relative flex items-center justify-center bg-[#047857] hover:bg-[#065f46] text-white w-9 h-9 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <span className="absolute -top-1 -right-1 bg-emerald-300 text-emerald-900 text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">{cartCount}</span>
            </button>
          </div>

          {/* Desktop Layout (hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md border border-white/20">
                <Dna className="w-6.5 h-6.5 text-white animate-pulse" style={{ animationDuration: "4s" }} />
              </div>
              <div className="text-left leading-none">
                <span className="block text-[19px] font-black text-gray-900 tracking-tight uppercase">RL Australia</span>
                <span className="block text-[10px] text-emerald-600 font-extrabold uppercase tracking-[0.18em] mt-1">Peptide Research</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="flex items-center gap-0.5">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.submenu && setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${dropdown === link.label
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                  >
                    {link.label}
                    {link.submenu && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                  </Link>

                  {link.submenu && dropdown === link.label && (
                    <div className="absolute top-full left-0 pt-1 z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 min-w-[190px]">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop search form */}
              <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 w-44 lg:w-52 hover:border-emerald-300 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Search peptides..."
                  className="flex-1 bg-transparent text-xs outline-none ml-2 text-gray-700 placeholder:text-gray-400"
                />
              </div>

              {/* Login / Sign Up or Profile Dropdown */}
              {customer ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="hidden lg:flex items-center gap-2 text-xs font-medium text-gray-700 select-none cursor-pointer hover:opacity-90"
                  >
                    <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 flex-shrink-0 shadow-sm border border-pink-200">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[10px] text-gray-400 font-normal">Welcome</span>
                      <span className="text-xs font-bold text-gray-800 max-w-[90px] truncate">{customer.first_name || "User"}</span>
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-48 bg-white border border-gray-150 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <Link
                        href={customer.role === "admin" ? "/admin-dashboard" : "/customer-dashboard"}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-800 transition-colors w-full text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-450" />
                        Dashboard
                      </Link>
                      <button
                        onClick={async () => {
                          setProfileDropdownOpen(false)
                          const { signout } = await import("@lib/data/customer")
                          const pathParts = window.location.pathname.split("/")
                          const countryCode = pathParts[1] || "us"
                          await signout(countryCode)
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-650 hover:bg-red-50/40 hover:text-red-700 transition-colors w-full text-left border-t border-gray-100 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40 px-3 py-2 rounded-lg transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Cart */}
              <button
                onClick={openCartDrawer}
                className="relative flex items-center gap-1.5 bg-[#047857] hover:bg-[#065f46] text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-emerald-300 text-emerald-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              </button>
            </div>
          </div>

          {/* Row 2: Mobile Search Form (Styled matching reference image with brand color button) */}
          <div className="pb-3 md:hidden">
            <div className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl pl-3.5 pr-1 py-1 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all relative">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400 py-1.5"
              />
              <button className="flex items-center justify-center bg-[#047857] active:bg-[#065f46] hover:bg-[#065f46] text-white w-9 h-9 rounded-lg transition-colors shadow-sm ml-2">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Left Sidebar Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">RL</span>
            </div>
            <span className="text-sm font-bold text-gray-900">RL Australia</span>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Drawer search */}
        <div className="px-4 py-3">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
            <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search peptides..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400" />
          </div>
        </div>

        {/* Drawer nav links */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <nav className="space-y-0.5">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.submenu ? (
                  <>
                    <button
                      onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileSubmenuOpen === link.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileSubmenuOpen === link.label && (
                      <div className="pl-3 space-y-0.5 mt-0.5 mb-1">
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2 text-sm text-gray-500 hover:text-emerald-700 hover:bg-emerald-50/30 rounded-lg transition-colors"
                            onClick={() => setDrawerOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg transition-colors"
                    onClick={() => setDrawerOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Drawer footer — Login / Sign Up or Profile Actions */}
        <div className="px-4 py-4 border-t border-gray-100">
          {customer ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5 mb-2 bg-gray-50/70 border border-gray-100 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-500 border border-pink-200">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-[10px] text-gray-400">Welcome</span>
                  <span className="text-xs font-bold text-gray-800 truncate">{customer.first_name || "Profile"}</span>
                </div>
              </div>
              <Link
                href={customer.role === "admin" ? "/admin-dashboard" : "/customer-dashboard"}
                className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold text-gray-700 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 text-gray-450" />
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  setDrawerOpen(false)
                  const { signout } = await import("@lib/data/customer")
                  const pathParts = window.location.pathname.split("/")
                  const countryCode = pathParts[1] || "us"
                  await signout(countryCode)
                }}
                className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold text-red-600 border border-red-150 py-2.5 rounded-lg hover:bg-red-50/40 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                className="block w-full text-center text-sm font-medium text-gray-700 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block w-full text-center text-sm font-medium text-white bg-[#047857] py-2.5 rounded-lg hover:bg-[#065f46] transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar Drawer */}
      <CartDrawer />
    </>
  )
}
