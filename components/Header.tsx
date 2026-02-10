'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from './CartProvider'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { setIsOpen, itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link href="/" className="logo">
          auparts
        </Link>
        <nav className="nav">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/#collections" className="nav-link">
            Catalog
          </Link>
          <Link href="/#contact" className="nav-link">
            Contact
          </Link>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Account">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <button
            className="icon-btn"
            aria-label="Shopping cart"
            onClick={() => setIsOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="cart-count">{itemCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
