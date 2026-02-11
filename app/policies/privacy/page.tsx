'use client'

export default function PrivacyPolicy() {
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
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Privacy Policy</h1>

      <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Last updated: February 2026
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Information We Collect</h2>
        <p style={{ marginBottom: '1rem' }}>
          When you make a purchase, we collect the following information:
        </p>
        <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
          <li>Name</li>
          <li>Email address</li>
          <li>Shipping address</li>
          <li>Payment information (processed securely by Stripe)</li>
        </ul>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>How We Use Your Information</h2>
        <p style={{ marginBottom: '1rem' }}>
          We use the information we collect to:
        </p>
        <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
          <li>Process and fulfill your orders</li>
          <li>Send you order confirmations and shipping updates</li>
          <li>Respond to your questions or concerns</li>
        </ul>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Payment Security</h2>
        <p style={{ marginBottom: '1rem' }}>
          All payment processing is handled by Stripe. We never store your credit card information on our servers. Stripe is PCI-DSS compliant, ensuring your payment data is handled securely.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Third-Party Services</h2>
        <p style={{ marginBottom: '1rem' }}>
          We use the following third-party services:
        </p>
        <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
          <li>Stripe - Payment processing</li>
          <li>Vercel - Website hosting</li>
        </ul>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Data Retention</h2>
        <p style={{ marginBottom: '1rem' }}>
          We retain your order information for our records and to provide customer support. If you would like your data deleted, please contact us.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Your Rights</h2>
        <p style={{ marginBottom: '1rem' }}>
          You have the right to access, correct, or delete your personal information. Contact us to make any such requests.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Changes to This Policy</h2>
        <p style={{ marginBottom: '1rem' }}>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us</h2>
        <p style={{ marginBottom: '1rem' }}>
          For any questions about this privacy policy, please contact us via our TikTok page or through the contact section on our website.
        </p>
      </div>
    </main>
  )
}
