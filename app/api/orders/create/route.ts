import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json()

    if (!session_id) {
      return NextResponse.json({ error: 'No session ID provided' }, { status: 400 })
    }

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session_id)
      .single()

    if (existingOrder) {
      return NextResponse.json({ message: 'Order already exists', order: existingOrder })
    }

    // Fetch session from Stripe
    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}?expand[]=line_items&expand[]=customer_details`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    })

    if (!stripeResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch session from Stripe' }, { status: 400 })
    }

    const session = await stripeResponse.json()

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Format shipping address
    const shipping = session.shipping_details || session.customer_details
    const address = shipping?.address
    const shippingAddress = address
      ? `${shipping.name || ''}, ${address.line1 || ''}, ${address.line2 || ''}, ${address.city || ''}, ${address.state || ''} ${address.postal_code || ''}, ${address.country || ''}`.replace(/, ,/g, ',').replace(/^, |, $/g, '')
      : 'No address provided'

    // Format line items
    const items = session.line_items?.data?.map((item: { description: string; quantity: number; amount_total: number }) => ({
      name: item.description,
      quantity: item.quantity,
      price: item.amount_total,
    })) || []

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session_id,
        customer_email: session.customer_details?.email || '',
        customer_name: session.customer_details?.name || shipping?.name || '',
        shipping_address: shippingAddress,
        items: JSON.stringify(items),
        total: session.amount_total,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Order created', order })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
