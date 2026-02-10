'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/supabase'
import { useCart } from './CartProvider'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Image
          src={`/images/${product.image}`}
          alt={product.name}
          width={300}
          height={300}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {product.badge && (
          <span className={`badge ${product.badge}`}>{product.badge}</span>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        {product.in_stock && (
          <div className="stock-indicator">
            <span className="stock-dot"></span>
            <span>In stock</span>
          </div>
        )}
        <div className="product-pricing">
          <span className={`price ${product.badge === 'sale' ? 'price-sale' : ''}`}>
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <span className="price-compare">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
        <button
          className={`btn btn-add ${added ? 'added' : ''}`}
          onClick={handleAdd}
        >
          {added ? 'Added!' : 'Add'}
        </button>
      </div>
    </div>
  )
}
