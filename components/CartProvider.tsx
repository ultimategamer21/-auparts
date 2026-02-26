'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/supabase'

export type CartItem = {
  product: Product
  quantity: number
}

type PromoDiscount = {
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number // percentage or cents
}

type CartContextType = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  subtotal: number
  shipping: number
  total: number
  itemCount: number
  promoDiscount: PromoDiscount | null
  promoError: string | null
  promoLoading: boolean
  applyPromoCode: (code: string) => Promise<void>
  removePromoCode: () => void
  discountAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shippingRate, setShippingRate] = useState(0)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(10000)
  const [promoDiscount, setPromoDiscount] = useState<PromoDiscount | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  // Load cart from localStorage and fetch shipping settings
  useEffect(() => {
    const savedCart = localStorage.getItem('auparts-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart:', e)
      }
    }
    setIsLoaded(true)

    // Fetch shipping settings
    fetch('/api/settings/shipping')
      .then(res => res.json())
      .then(data => {
        setShippingRate(data.shipping_rate || 0)
        setFreeShippingThreshold(data.free_shipping_threshold || 10000)
      })
      .catch(() => {
        // Use defaults on error
      })
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('auparts-cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (product: Product) => {
    setItems(current => {
      const existingItem = current.find(item => item.product.id === product.id)
      if (existingItem) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...current, { product, quantity: 1 }]
    })
    setIsOpen(true)
  }

  const removeItem = (productId: string) => {
    setItems(current => current.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    setPromoDiscount(null)
    setPromoError(null)
  }

  const applyPromoCode = async (code: string) => {
    if (!code.trim()) {
      setPromoError('Please enter a promo code')
      return
    }

    setPromoLoading(true)
    setPromoError(null)

    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setPromoError(data.error || 'Invalid promo code')
        setPromoDiscount(null)
      } else {
        setPromoDiscount({
          code: data.code,
          discountType: data.discount_type,
          discountValue: data.discount_value,
        })
        setPromoError(null)
      }
    } catch {
      setPromoError('Failed to validate promo code')
      setPromoDiscount(null)
    } finally {
      setPromoLoading(false)
    }
  }

  const removePromoCode = () => {
    setPromoDiscount(null)
    setPromoError(null)
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  // Calculate discount amount
  let discountAmount = 0
  if (promoDiscount) {
    if (promoDiscount.discountType === 'percent') {
      discountAmount = Math.round(subtotal * (promoDiscount.discountValue / 100))
    } else {
      // Fixed amount (already in cents)
      discountAmount = Math.min(promoDiscount.discountValue, subtotal)
    }
  }

  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate
  const total = subtotal - discountAmount + shipping
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        subtotal,
        shipping,
        total,
        itemCount,
        promoDiscount,
        promoError,
        promoLoading,
        applyPromoCode,
        removePromoCode,
        discountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
