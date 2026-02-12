import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { getProductsByCategory, getFeaturedProducts } from '@/lib/products'

export const revalidate = 60 // Revalidate every 60 seconds

// Featured products to show on homepage
const FEATURED_PRODUCT_NAMES = [
  'Ultra Bee Supermoto Wheel Set',
  'Light Bee Supermoto Wheel Set',
  'ODI Number Plate',
  'Motocutz Plate',
]

export default async function Home() {
  const ultraBeeProducts = await getProductsByCategory('ultra-bee')
  const lightBeeProducts = await getProductsByCategory('light-bee')
  const fatTireProducts = await getProductsByCategory('fat-tire')
  const featuredProducts = await getFeaturedProducts(FEATURED_PRODUCT_NAMES)

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
              src="/images/fat-tire-collection.jpeg"
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
              src="/images/ultra-bee-collection.jpeg"
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
              src="/images/light-bee-collection.jpeg"
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

      {/* Featured Products */}
      <section id="featured" className="products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link href="/catalog" className="section-link">
            View all →
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
