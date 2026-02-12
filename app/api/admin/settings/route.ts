import { NextRequest, NextResponse } from 'next/server'
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
      // Return defaults if no settings exist
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    return NextResponse.json(data.value)
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shipping_rate, free_shipping_threshold } = body

    // Upsert the settings
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'shipping',
        value: {
          shipping_rate: Math.round(shipping_rate),
          free_shipping_threshold: Math.round(free_shipping_threshold),
        },
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      })

    if (error) {
      console.error('Error saving settings:', error)
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
