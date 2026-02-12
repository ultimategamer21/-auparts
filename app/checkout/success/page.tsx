'use client'

import { useEffect } from 'react'
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
      paddingTop: 'calc(64px + 2rem)',
      position: 'relative',
      zIndex: 10,
    }}>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#22c55e' }}>✓</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Thank you for your order!</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
          We&apos;ve received your order and will ship it soon.<br />
          You&apos;ll receive an email confirmation shortly.
        </p>
        <a
          href="/"
          className="btn btn-primary"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
          }}
        >
          Continue Shopping
        </a>
      </div>
    </main>
  )
}
