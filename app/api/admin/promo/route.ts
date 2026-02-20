import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json([])
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Uppercase the code
    body.code = body.code.toUpperCase()

    const { data, error } = await supabase
      .from('promo_codes')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating promo code:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    revalidatePath('/admin')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 })
  }
}
