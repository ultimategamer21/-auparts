import { supabase, Product } from './supabase'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductsByCategory(category: 'ultra-bee' | 'light-bee' | 'fat-tire'): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function getFeaturedProducts(names: string[]): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  // Filter and sort by the order of names provided
  const products = data || []
  const featured: Product[] = []

  for (const name of names) {
    const product = products.find(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    )
    if (product) {
      featured.push(product)
    }
  }

  return featured
}

export type Collection = {
  id: string
  name: string
  slug: string
  image: string
  sort_order: number
}

export async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }

  return data || []
}
