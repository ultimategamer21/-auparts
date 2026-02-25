'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/supabase'
import { useCart } from './CartProvider'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function getImageSrc(image: string): string {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/images/${image}`
}

function getFirstImage(imageField: string): string {
  if (!imageField) return ''
  // Get first image if comma-separated
  const firstImage = imageField.split(',')[0].trim()
  return firstImage
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const imageSrc = getImageSrc(getFirstImage(product.image))

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-image-wrapper">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            width={300}
            height={300}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            unoptimized={imageSrc.startsWith('http')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
            No image
          </div>
        )}
        {product.badge && (
          <span className={`badge ${product.badge}`}>{product.badge}</span>
        )}
        {product.preorder && (
          <span className="badge" style={{ background: '#8b5cf6' }}>Pre-order</span>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        {product.preorder ? (
          <div className="stock-indicator" style={{ color: '#8b5cf6' }}>
            <span className="stock-dot" style={{ background: '#8b5cf6' }}></span>
            <span>Pre-order</span>
          </div>
        ) : product.in_stock ? (
          <div className="stock-indicator">
            <span className="stock-dot"></span>
            <span>In stock</span>
          </div>
        ) : null}
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
          style={product.preorder ? { background: '#8b5cf6' } : undefined}
        >
          {added ? 'Added!' : product.preorder ? 'Pre-order' : 'Add'}
        </button>
      </div>
    </Link>
  )
}
