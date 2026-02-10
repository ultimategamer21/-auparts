'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'

export default function CheckoutSuccess() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      paddingTop: 'calc(64px + 2rem)'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Thank you for your order!</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
          We&apos;ve received your order and will ship it soon.<br />
          You&apos;ll receive an email confirmation shortly.
        </p>
        <Link href="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </main>
  )
}
