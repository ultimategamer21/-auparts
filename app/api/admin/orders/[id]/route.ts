import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('orders')
      .update({
        status: body.status,
        tracking_number: body.tracking_number,
        tracking_url: body.tracking_url,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
