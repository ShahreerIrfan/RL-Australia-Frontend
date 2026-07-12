"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Home, ShoppingCart, ShoppingBag, User } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function MobileBottomNav() {
  const pathname = usePathname()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "au"

  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartId = typeof window !== "undefined" ? localStorage.getItem("rl_cart_id") : null
        if (!cartId) return
        const res = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
          cache: "no-store",
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
          }
        })
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

  const openCartDrawer = (e: React.MouseEvent) => {
    e.preventDefault()
    window.dispatchEvent(new Event("open-cart-drawer"))
  }

  // Define bottom bar link elements
  const links = [
    {
      label: "Home",
      icon: Home,
      href: `/${countryCode}`,
      isActive: pathname === `/${countryCode}` || pathname === `/${countryCode}/`
    },
    {
      label: "Shop",
      icon: ShoppingBag,
      href: `/${countryCode}/store`,
      isActive: pathname.includes(`/${countryCode}/store`) || pathname.includes(`/${countryCode}/products`) || pathname.includes(`/${countryCode}/categories`)
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      href: `/${countryCode}/cart`,
      onClick: openCartDrawer,
      isActive: pathname.includes(`/${countryCode}/cart`),
      badge: cartCount
    },
    {
      label: "Account",
      icon: User,
      href: `/${countryCode}/account`,
      isActive: pathname.includes(`/${countryCode}/account`)
    }
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 pb-4">
      <div 
        className="w-full max-w-md bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.14)] pointer-events-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex justify-around items-center h-16">
          {links.map((link) => {
            const Icon = link.icon
            const active = link.isActive

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                className="flex flex-col items-center justify-center flex-1 py-1 text-center relative group active:scale-95 transition-transform duration-100"
              >
                <div className="relative flex items-center justify-center">
                  <Icon 
                    className={`w-5.5 h-5.5 transition-all duration-300 ${
                      active 
                        ? "text-sky-600 scale-110" 
                        : "text-gray-500 group-hover:text-sky-600"
                    }`} 
                    strokeWidth={active ? 2.5 : 2}
                  />
                  
                  {/* Badge Count Bubble */}
                  {!!link.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {link.badge}
                    </span>
                  )}
                </div>

                <span 
                  className={`text-[10px] mt-1.5 font-bold transition-colors duration-300 ${
                    active 
                      ? "text-sky-600 font-extrabold" 
                      : "text-gray-500 group-hover:text-sky-600"
                  }`}
                >
                  {link.label}
                </span>

                {/* Micro dot underneath active tab */}
                {active && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 bg-sky-600 rounded-full shadow-sm" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
