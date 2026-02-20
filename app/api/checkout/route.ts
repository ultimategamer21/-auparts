import { NextRequest, NextResponse } from 'next/server'
import { CartItem } from '@/components/CartProvider'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getShippingSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'shipping')
      .single()

    if (error || !data) {
      return { shipping_rate: 1000, free_shipping_threshold: 10000 }
    }
    return data.value
  } catch {
    return { shipping_rate: 1000, free_shipping_threshold: 10000 }
  }
}

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}[${key}]` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey))
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          Object.assign(result, flattenObject(item as Record<string, unknown>, `${newKey}[${index}]`))
        } else {
          result[`${newKey}[${index}]`] = String(item)
        }
      })
    } else if (value !== undefined && value !== null) {
      result[newKey] = String(value)
    }
  }
  return result
}

async function stripeRequest(endpoint: string, body: Record<string, unknown>) {
  const response = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(flattenObject(body)).toString(),
  })
  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      )
    }

    const { items } = await request.json() as { items: CartItem[] }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    // Get dynamic shipping settings
    const shippingSettings = await getShippingSettings()
    const SHIPPING_RATE = shippingSettings.shipping_rate
    const FREE_SHIPPING_THRESHOLD = shippingSettings.free_shipping_threshold

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE

    const getImageUrl = (image: string) => {
      if (image?.startsWith('http')) return image
      return `${process.env.NEXT_PUBLIC_BASE_URL || 'https://auparts.vercel.app'}/images/${image}`
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.product.name,
          images: item.product.image ? [getImageUrl(item.product.image)] : [],
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: 'Shipping',
            images: [],
          },
          unit_amount: shipping,
        },
        quantity: 1,
      })
    }

    // Build checkout session params
    const sessionParams: Record<string, unknown> = {
      'payment_method_types': ['card'],
      'mode': 'payment',
      'allow_promotion_codes': 'true',
      'success_url': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://auparts.vercel.app'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://auparts.vercel.app'}`,
      'shipping_address_collection': {
        'allowed_countries': ['US', 'CA', 'AU', 'GB'],
      },
    }

    // Add line items
    lineItems.forEach((item, index) => {
      sessionParams[`line_items[${index}][price_data][currency]`] = item.price_data.currency
      sessionParams[`line_items[${index}][price_data][unit_amount]`] = item.price_data.unit_amount
      sessionParams[`line_items[${index}][price_data][product_data][name]`] = item.price_data.product_data.name
      if (item.price_data.product_data.images.length > 0) {
        sessionParams[`line_items[${index}][price_data][product_data][images][0]`] = item.price_data.product_data.images[0]
      }
      sessionParams[`line_items[${index}][quantity]`] = item.quantity
    })

    const session = await stripeRequest('checkout/sessions', sessionParams)

    if (session.error) {
      return NextResponse.json({ error: session.error.message }, { status: 400 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to create checkout session: ${message}` },
      { status: 500 }
    )
  }
}
