'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 2000)
  }

  return (
    <footer id="contact" className="footer">
      <div className="footer-content">
        <div className="newsletter">
          <h3>Subscribe to our emails</h3>
          <p>Be the first to know about new collections and exclusive offers.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              {subscribed ? '✓' : '→'}
            </button>
          </form>
        </div>
        <div className="footer-bottom">
          <p>© 2026, auparts. All rights reserved.</p>
          <div className="footer-links">
            <Link href="#">Refund policy</Link>
            <Link href="#">Privacy policy</Link>
            <Link href="#">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
