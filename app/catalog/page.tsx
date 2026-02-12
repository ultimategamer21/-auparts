import ProductCard from '@/components/ProductCard'
import { getProducts, getProductsByCategory } from '@/lib/products'

export const revalidate = 60

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category

  let products
  let title = 'All Products'

  if (category === 'ultra-bee') {
    products = await getProductsByCategory('ultra-bee')
    title = 'Surron Ultra Bee'
  } else if (category === 'light-bee') {
    products = await getProductsByCategory('light-bee')
    title = 'Surron Light Bee'
  } else if (category === 'fat-tire') {
    products = await getProductsByCategory('fat-tire')
    title = 'Fat Tire'
  } else {
    products = await getProducts()
  }

  return (
    <main style={{
      minHeight: '100vh',
      padding: '2rem',
      paddingTop: 'calc(64px + 2rem)',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h1 style={{ fontSize: '2rem' }}>{title}</h1>
          {category && (
            <a
              href="/catalog"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
              }}
            >
              ← All Products
            </a>
          )}
        </div>

        {/* Category filters */}
        {!category && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}>
            <a
              href="/catalog?category=fat-tire"
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Fat Tire
            </a>
            <a
              href="/catalog?category=ultra-bee"
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Surron Ultra Bee
            </a>
            <a
              href="/catalog?category=light-bee"
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Surron Light Bee
            </a>
          </div>
        )}

        {products.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>No products found.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
