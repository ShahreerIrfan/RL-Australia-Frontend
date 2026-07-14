'use client'

import { useEffect } from 'react'

export default function CartClearer() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      // Break out of the iframe
      window.parent.location.href = window.location.href
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get('clear_cart') === 'true') {
      localStorage.removeItem('rl_cart_id')
      document.cookie = '_medusa_cart_id=; path=/; max-age=-1'
      window.dispatchEvent(new Event('cart-updated'))
    }
  }, [])

  return null
}
