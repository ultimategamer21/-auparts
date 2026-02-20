import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Uppercase the code
    if (body.code) {
      body.code = body.code.toUpperCase()
    }

    const { data, error } = await supabase
      .from('promo_codes')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating promo code:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    revalidatePath('/admin')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting promo code:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    revalidatePath('/admin')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 })
  }
}
