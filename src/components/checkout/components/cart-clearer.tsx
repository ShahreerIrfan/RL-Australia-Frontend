'use client'

import { useEffect } from 'react'

export default function CartClearer() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('clear_cart') === 'true') {
      localStorage.removeItem('rl_cart_id')
      document.cookie = '_medusa_cart_id=; path=/; max-age=-1'
      window.dispatchEvent(new Event('cart-updated'))
    }
  }, [])

  return null
}
