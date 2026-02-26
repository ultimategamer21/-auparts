'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from './CartProvider'

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function getImageSrc(image: string): string {
  if (!image) return ''
  // Get first image if comma-separated
  const firstImage = image.split(',')[0].trim()
  if (firstImage.startsWith('http')) return firstImage
  return `/images/${firstImage}`
}

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isOpen,
    setIsOpen,
    subtotal,
    shipping,
    total,
    promoDiscount,
    promoError,
    promoLoading,
    applyPromoCode,
    removePromoCode,
    discountAmount,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')

  const handleApplyPromo = () => {
    applyPromoCode(promoInput)
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          promoCode: promoDiscount ? {
            code: promoDiscount.code,
            discountType: promoDiscount.discountType,
            discountValue: promoDiscount.discountValue,
          } : null,
        }),
      })

      const { url, error } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        alert(error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>
          <button
            className="cart-drawer-close"
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => {
              const imgSrc = getImageSrc(item.product.image)
              return (
              <div key={item.product.id} className="cart-item">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="cart-item-image"
                    unoptimized={imgSrc.startsWith('http')}
                  />
                ) : (
                  <div className="cart-item-image" style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>No img</span>
                  </div>
                )}
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-price">
                    {formatPrice(item.product.price)}
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )})
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Section */}
            <div style={{ marginBottom: '1rem' }}>
              {promoDiscount ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                }}>
                  <div>
                    <span style={{ color: '#22c55e', fontWeight: 500 }}>
                      {promoDiscount.code}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                      {promoDiscount.discountType === 'percent'
                        ? `${promoDiscount.discountValue}% off`
                        : `${formatPrice(promoDiscount.discountValue)} off`}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      removePromoCode()
                      setPromoInput('')
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      fontSize: '1.25rem',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      disabled={promoLoading}
                      style={{
                        flex: 1,
                        padding: '0.625rem 0.75rem',
                        borderRadius: '8px',
                        border: promoError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      style={{
                        padding: '0.625rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        cursor: promoLoading || !promoInput.trim() ? 'not-allowed' : 'pointer',
                        opacity: promoLoading || !promoInput.trim() ? 0.5 : 1,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {promoLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {promoError && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>
                      {promoError}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="cart-discount" style={{ color: '#22c55e' }}>
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="cart-shipping">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
