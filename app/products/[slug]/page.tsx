import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AddToCartButton from './AddToCartButton'
import ProductGallery from './ProductGallery'

export const revalidate = 60

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function getImageSrc(image: string): string {
  if (!image) return '/images/placeholder.jpeg'
  if (image.startsWith('http')) return image
  return `/images/${image}`
}

function parseImages(imageField: string): string[] {
  if (!imageField) return []
  // Support comma-separated images
  return imageField.split(',').map(img => img.trim()).filter(Boolean)
}

async function getProduct(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

async function getRelatedProducts(category: string, currentId: string) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentId)
    .limit(4)

  return data || []
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)
  const images = parseImages(product.image)

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)' }}>Home</Link>
          <span style={{ margin: '0 0.5rem', color: 'rgba(255,255,255,0.4)' }}>/</span>
          <Link href={`/#${product.category}`} style={{ color: 'rgba(255,255,255,0.6)' }}>
            {product.category === 'ultra-bee' ? 'Ultra Bee' : 'Light Bee'}
          </Link>
          <span style={{ margin: '0 0.5rem', color: 'rgba(255,255,255,0.4)' }}>/</span>
          <span style={{ color: 'white' }}>{product.name}</span>
        </nav>

        {/* Product Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Image Gallery */}
          <ProductGallery
            images={images}
            productName={product.name}
            badge={product.badge}
          />

          {/* Info */}
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: product.badge === 'sale' ? '#ef4444' : 'white',
              }}>
                {formatPrice(product.price)}
              </span>
              {product.compare_price && (
                <span style={{
                  fontSize: '1.25rem',
                  color: 'rgba(255,255,255,0.5)',
                  textDecoration: 'line-through',
                }}>
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {product.in_stock ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#22c55e',
                marginBottom: '1.5rem',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                }}></span>
                In stock
              </div>
            ) : (
              <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}>Out of stock</div>
            )}

            <p style={{
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}>
              {product.description}
            </p>

            <AddToCartButton product={product} />

            {/* Product Details */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Details</h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.875rem',
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'white' }}>Category:</strong>{' '}
                  {product.category === 'ultra-bee' ? 'Ultra Bee' : 'Light Bee'}
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'white' }}>SKU:</strong>{' '}
                  {product.slug.toUpperCase()}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>You might also like</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '1' }}>
                    <Image
                      src={getImageSrc(parseImages(item.image)[0] || item.image)}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={item.image?.startsWith('http')}
                    />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                    <span style={{ fontWeight: 'bold' }}>{formatPrice(item.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
