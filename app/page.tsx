import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { getProductsByCategory } from '@/lib/products'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  const ultraBeeProducts = await getProductsByCategory('ultra-bee')
  const lightBeeProducts = await getProductsByCategory('light-bee')
  const fatTireProducts = await getProductsByCategory('fat-tire')

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <Image
            src="/images/hero-bike.jpeg"
            alt="Surron Ultra Bee"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 60%', transform: 'scale(1.3)' }}
          />
        </div>
        <div className="hero-content">
          <h1>Shop our latest arrivals!</h1>
          <p>Premium parts and accessories for your Surron</p>
          <Link href="#collections" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="collections">
        <div className="section-header">
          <h2 className="section-title">Collections</h2>
          <Link href="/catalog" className="section-link">
            View all →
          </Link>
        </div>
        <div className="collections-grid three-col">
          <Link href="/catalog?category=fat-tire" className="collection-card">
            <Image
              src="/images/fatboy-baja-headlight-1.jpeg"
              alt="Fat Tire Parts"
              fill
              className="collection-image"
            />
            <div className="collection-overlay">
              <h3>Fat Tire Parts</h3>
              <span>{fatTireProducts.length} Products</span>
            </div>
          </Link>
          <Link href="/catalog?category=ultra-bee" className="collection-card">
            <Image
              src="/images/baja-headlight.jpeg"
              alt="Ultra Bee Parts"
              fill
              className="collection-image"
            />
            <div className="collection-overlay">
              <h3>Ultra Bee Parts</h3>
              <span>{ultraBeeProducts.length} Products</span>
            </div>
          </Link>
          <Link href="/catalog?category=light-bee" className="collection-card">
            <Image
              src="/images/motor-guard.jpeg"
              alt="Light Bee Parts"
              fill
              className="collection-image"
            />
            <div className="collection-overlay">
              <h3>Light Bee Parts</h3>
              <span>{lightBeeProducts.length} Products</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Fat Tire Parts */}
      {fatTireProducts.length > 0 && (
        <section id="fat-tire" className="products-section">
          <div className="section-header">
            <h2 className="section-title">Fat Tire Parts</h2>
            <Link href="/catalog?category=fat-tire" className="section-link">
              View all →
            </Link>
          </div>
          <div className="products-grid">
            {fatTireProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Ultra Bee Parts */}
      <section id="ultra-bee" className="products-section">
        <div className="section-header">
          <h2 className="section-title">Ultra Bee Parts</h2>
          <Link href="/catalog?category=ultra-bee" className="section-link">
            View all →
          </Link>
        </div>
        <div className="products-grid">
          {ultraBeeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Light Bee Parts */}
      <section id="light-bee" className="products-section">
        <div className="section-header">
          <h2 className="section-title">Light Bee Parts</h2>
          <Link href="/catalog?category=light-bee" className="section-link">
            View all →
          </Link>
        </div>
        <div className="products-grid">
          {lightBeeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
