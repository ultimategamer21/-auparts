import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Default shipping settings
const DEFAULT_SETTINGS = {
  shipping_rate: 1000, // $10 in cents
  free_shipping_threshold: 10000, // $100 in cents
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'shipping')
      .single()

    if (error || !data) {
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    return NextResponse.json(data.value)
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}
