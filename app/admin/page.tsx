'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SafeImage from '@/components/SafeImage'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  image: string
  category: 'ultra-bee' | 'light-bee' | 'fat-tire'
  in_stock: boolean
  badge: 'new' | 'sale' | null
}

const emptyProduct = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  compare_price: null as number | null,
  image: '',
  category: 'ultra-bee' as const,
  in_stock: true,
  badge: null as 'new' | 'sale' | null,
}

type ShippingSettings = {
  shipping_rate: number
  free_shipping_threshold: number
}

type Collection = {
  id: string
  name: string
  slug: string
  image: string
  sort_order: number
}

const emptyCollection = {
  name: '',
  slug: '',
  image: '',
  sort_order: 0,
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [isNewCollection, setIsNewCollection] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingCollection, setUploadingCollection] = useState(false)
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shipping_rate: 1000,
    free_shipping_threshold: 10000,
  })
  const [savingShipping, setSavingShipping] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
    fetchCollections()
    fetchShippingSettings()
  }, [])

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products')
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }

  const fetchCollections = async () => {
    const res = await fetch('/api/admin/collections')
    if (res.ok) {
      const data = await res.json()
      setCollections(data)
    }
  }

  const handleSaveCollection = async () => {
    if (!editingCollection) return
    setSaving(true)

    const url = isNewCollection
      ? '/api/admin/collections'
      : `/api/admin/collections/${editingCollection.id}`

    const res = await fetch(url, {
      method: isNewCollection ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCollection),
    })

    if (res.ok) {
      await fetchCollections()
      setEditingCollection(null)
      setIsNewCollection(false)
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to save collection')
    }
    setSaving(false)
  }

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    const res = await fetch(`/api/admin/collections/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      await fetchCollections()
    } else {
      alert('Failed to delete collection')
    }
  }

  const handleCollectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingCollection) return

    setUploadingCollection(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setEditingCollection({ ...editingCollection, image: url })
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to upload image')
      }
    } catch {
      alert('Failed to upload image')
    }
    setUploadingCollection(false)
  }

  const fetchShippingSettings = async () => {
    const res = await fetch('/api/admin/settings')
    if (res.ok) {
      const data = await res.json()
      setShippingSettings(data)
    }
  }

  const saveShippingSettings = async () => {
    setSavingShipping(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shippingSettings),
    })
    if (res.ok) {
      alert('Shipping settings saved!')
    } else {
      alert('Failed to save shipping settings')
    }
    setSavingShipping(false)
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)

    // Convert dollars back to cents for saving
    const productData = {
      ...editing,
      price: Math.round(editing.price * 100),
      compare_price: editing.compare_price ? Math.round(editing.compare_price * 100) : null,
    }

    const url = isNew
      ? '/api/admin/products'
      : `/api/admin/products/${editing.id}`

    const res = await fetch(url, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })

    if (res.ok) {
      await fetchProducts()
      setEditing(null)
      setIsNew(false)
    } else {
      const error = await res.json()
      alert(error.error || 'Failed to save product')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      await fetchProducts()
    } else {
      alert('Failed to delete product')
    }
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editing) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        setEditing({ ...editing, image: url })
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to upload image')
      }
    } catch {
      alert('Failed to upload image')
    }
    setUploading(false)
  }

  const getImageSrc = (image: string) => {
    if (!image) return null
    // Get first image if comma-separated
    const firstImage = image.split(',')[0].trim()
    if (!firstImage) return null
    if (firstImage.startsWith('http')) return firstImage
    return `/images/${firstImage}`
  }

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.in_stock).length,
    outOfStock: products.filter(p => !p.in_stock).length,
    ultraBee: products.filter(p => p.category === 'ultra-bee').length,
    lightBee: products.filter(p => p.category === 'light-bee').length,
    onSale: products.filter(p => p.badge === 'sale').length,
    newItems: products.filter(p => p.badge === 'new').length,
  }

  if (loading) {
    return (
      <main style={{ padding: '6rem 2rem 2rem', textAlign: 'center' }}>
        Loading...
      </main>
    )
  }

  return (
    <main style={{ padding: '6rem 2rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
      {/* Dashboard Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.total}</div>
          <div style={statLabelStyle}>Total Products</div>
        </div>
        <div style={{ ...statCardStyle, borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <div style={{ ...statNumberStyle, color: '#22c55e' }}>{stats.inStock}</div>
          <div style={statLabelStyle}>In Stock</div>
        </div>
        <div style={{ ...statCardStyle, borderColor: stats.outOfStock > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)' }}>
          <div style={{ ...statNumberStyle, color: stats.outOfStock > 0 ? '#ef4444' : 'white' }}>{stats.outOfStock}</div>
          <div style={statLabelStyle}>Out of Stock</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.ultraBee}</div>
          <div style={statLabelStyle}>Ultra Bee</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.lightBee}</div>
          <div style={statLabelStyle}>Light Bee</div>
        </div>
        <div style={{ ...statCardStyle, borderColor: 'rgba(251, 191, 36, 0.3)' }}>
          <div style={{ ...statNumberStyle, color: '#fbbf24' }}>{stats.onSale}</div>
          <div style={statLabelStyle}>On Sale</div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>Shipping Settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Shipping Rate ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={shippingSettings.shipping_rate === 0 ? '' : shippingSettings.shipping_rate / 100}
              onChange={(e) => setShippingSettings({
                ...shippingSettings,
                shipping_rate: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 0
              })}
              style={inputStyle}
              placeholder="e.g. 10.00"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Free Shipping Over ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={shippingSettings.free_shipping_threshold === 0 ? '' : shippingSettings.free_shipping_threshold / 100}
              onChange={(e) => setShippingSettings({
                ...shippingSettings,
                free_shipping_threshold: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 0
              })}
              style={inputStyle}
              placeholder="e.g. 100.00"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={saveShippingSettings}
            disabled={savingShipping}
            style={{ height: '44px' }}
          >
            {savingShipping ? 'Saving...' : 'Save Shipping'}
          </button>
        </div>
        <p style={{ margin: '1rem 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
          Set shipping rate to $0 to disable shipping charges. Orders over the threshold get free shipping.
        </p>
      </div>

      {/* Promo Codes - Link to Stripe */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem' }}>Promo Codes</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 1rem', fontSize: '0.875rem' }}>
          Promo codes are managed in your Stripe Dashboard. Customers can enter codes at checkout.
        </p>
        <a
          href="https://dashboard.stripe.com/coupons"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          Manage in Stripe Dashboard
        </a>
      </div>

      {/* Collections Management */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Collections</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingCollection(emptyCollection as Collection)
              setIsNewCollection(true)
            }}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            + Add Collection
          </button>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {collections.map((collection) => (
            <div
              key={collection.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr auto auto',
                gap: '1rem',
                alignItems: 'center',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            >
              <div style={{ width: '60px', height: '60px', position: 'relative', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                <SafeImage
                  src={getImageSrc(collection.image) || ''}
                  alt={collection.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized={collection.image?.startsWith('http')}
                  fallbackText="No img"
                />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{collection.name}</h4>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>/{collection.slug}</p>
              </div>
              <button
                onClick={() => {
                  setEditingCollection(collection)
                  setIsNewCollection(false)
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCollection(collection.id)}
                style={{
                  background: 'rgba(255,100,100,0.2)',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Delete
              </button>
            </div>
          ))}
          {collections.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '1rem' }}>
              No collections yet. Click &quot;Add Collection&quot; to create one.
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Product Management</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(emptyProduct as Product)
              setIsNew(true)
            }}
          >
            + Add Product
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Product List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr auto auto auto',
              gap: '1rem',
              alignItems: 'center',
              padding: '1rem',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
            }}
          >
            <div style={{ width: '80px', height: '80px', position: 'relative', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
              <SafeImage
                src={getImageSrc(product.image) || ''}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized={product.image?.startsWith('http')}
              />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{product.name}</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                {product.category} {product.badge && `• ${product.badge}`} {!product.in_stock && '• Out of stock'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold' }}>{formatPrice(product.price)}</div>
              {product.compare_price && (
                <div style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontSize: '0.875rem' }}>
                  {formatPrice(product.compare_price)}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                // Convert cents to dollars for editing
                setEditing({
                  ...product,
                  price: product.price / 100,
                  compare_price: product.compare_price ? product.compare_price / 100 : null,
                })
                setIsNew(false)
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              style={{
                background: 'rgba(255,100,100,0.2)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                color: '#ff6b6b',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '3rem' }}>
          No products yet. Click &quot;Add Product&quot; to create one.
        </p>
      )}

      {/* Edit Modal */}
      {editing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 1000,
          }}
          onClick={() => { setEditing(null); setIsNew(false) }}
        >
          <div
            style={{
              background: '#111',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>{isNew ? 'Add Product' : 'Edit Product'}</h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Compare Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.compare_price || ''}
                    onChange={(e) => setEditing({ ...editing, compare_price: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="Optional"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Image</label>
                {editing.image && (
                  <div style={{ marginBottom: '0.5rem', position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                    <SafeImage
                      src={getImageSrc(editing.image) || ''}
                      alt="Product"
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={editing.image?.startsWith('http')}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                />
                {uploading && <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.6)' }}>Uploading...</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Category</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value as 'ultra-bee' | 'light-bee' | 'fat-tire' })}
                    style={inputStyle}
                  >
                    <option value="fat-tire">Fat Tire</option>
                    <option value="ultra-bee">Ultra Bee</option>
                    <option value="light-bee">Light Bee</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Badge</label>
                  <select
                    value={editing.badge || ''}
                    onChange={(e) => setEditing({ ...editing, badge: e.target.value as 'new' | 'sale' | null || null })}
                    style={inputStyle}
                  >
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editing.in_stock}
                    onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })}
                  />
                  In Stock
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
                <button
                  onClick={() => { setEditing(null); setIsNew(false) }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Edit Modal */}
      {editingCollection && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 1000,
          }}
          onClick={() => { setEditingCollection(null); setIsNewCollection(false) }}
        >
          <div
            style={{
              background: '#111',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '450px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>{isNewCollection ? 'Add Collection' : 'Edit Collection'}</h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Name</label>
                <input
                  type="text"
                  value={editingCollection.name}
                  onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                  placeholder="e.g. Fat Tire Parts"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Slug (URL)</label>
                <input
                  type="text"
                  value={editingCollection.slug}
                  onChange={(e) => setEditingCollection({ ...editingCollection, slug: e.target.value })}
                  placeholder="e.g. fat-tire (auto-generated if empty)"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Sort Order</label>
                <input
                  type="number"
                  value={editingCollection.sort_order}
                  onChange={(e) => setEditingCollection({ ...editingCollection, sort_order: parseInt(e.target.value) || 0 })}
                  style={inputStyle}
                />
                <p style={{ margin: '0.25rem 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  Lower numbers appear first
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Image</label>
                {editingCollection.image && (
                  <div style={{ marginBottom: '0.5rem', position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                    <SafeImage
                      src={getImageSrc(editingCollection.image) || ''}
                      alt="Collection"
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={editingCollection.image?.startsWith('http')}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCollectionImageUpload}
                  disabled={uploadingCollection}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                />
                {uploadingCollection && <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.6)' }}>Uploading...</p>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveCollection}
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? 'Saving...' : 'Save Collection'}
                </button>
                <button
                  onClick={() => { setEditingCollection(null); setIsNewCollection(false) }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '1rem',
}

const statCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '1.25rem',
  textAlign: 'center',
}

const statNumberStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '0.25rem',
}

const statLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'rgba(255,255,255,0.6)',
}
