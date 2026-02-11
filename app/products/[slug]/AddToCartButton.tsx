'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import { Product } from '@/lib/supabase'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, setIsOpen } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      setIsOpen(true)
    }, 500)
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          style={{
            width: '44px',
            height: '44px',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.25rem',
            cursor: 'pointer',
          }}
        >
          −
        </button>
        <span style={{
          width: '44px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          style={{
            width: '44px',
            height: '44px',
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.25rem',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={!product.in_stock}
        className="btn btn-primary"
        style={{
          flex: 1,
          height: '44px',
          opacity: product.in_stock ? 1 : 0.5,
          cursor: product.in_stock ? 'pointer' : 'not-allowed',
        }}
      >
        {added ? 'Added!' : product.in_stock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
}
