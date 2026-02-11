'use client'

export default function RefundPolicy() {
  return (
    <main style={{
      minHeight: '100vh',
      padding: '2rem',
      paddingTop: 'calc(64px + 3rem)',
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Refund Policy</h1>

      <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Last updated: February 2026
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Returns</h2>
        <p style={{ marginBottom: '1rem' }}>
          We accept returns within 30 days of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Refunds</h2>
        <p style={{ marginBottom: '1rem' }}>
          Once we receive your returned item, we will inspect it and notify you of the approval or rejection of your refund. If approved, your refund will be processed and a credit will automatically be applied to your original method of payment within 5-10 business days.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Exchanges</h2>
        <p style={{ marginBottom: '1rem' }}>
          We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us at the email below.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Shipping Returns</h2>
        <p style={{ marginBottom: '1rem' }}>
          You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Damaged or Defective Items</h2>
        <p style={{ marginBottom: '1rem' }}>
          If you receive a damaged or defective item, please contact us immediately with photos of the damage. We will arrange a replacement or full refund at no additional cost to you.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us</h2>
        <p style={{ marginBottom: '1rem' }}>
          For any questions about returns or refunds, please contact us via our TikTok page or through the contact section on our website.
        </p>
      </div>
    </main>
  )
}
