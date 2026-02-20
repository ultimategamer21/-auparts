import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
    }

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Promo code has expired' }, { status: 400 })
    }

    // Check usage limit
    if (data.usage_limit && data.times_used >= data.usage_limit) {
      return NextResponse.json({ error: 'Promo code usage limit reached' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      code: data.code,
      discount_type: data.discount_type, // 'percent' or 'fixed'
      discount_value: data.discount_value, // percentage or cents
    })
  } catch (error) {
    console.error('Promo validation error:', error)
    return NextResponse.json({ error: 'Failed to validate code' }, { status: 500 })
  }
}
