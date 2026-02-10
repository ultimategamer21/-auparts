import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  image: string
  category: 'ultra-bee' | 'light-bee'
  in_stock: boolean
  badge: 'new' | 'sale' | null
  created_at: string
}
