import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === 'authenticated'
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 })
  }

  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseKey) {
    return NextResponse.json({ error: 'Supabase key not configured' }, { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey
  )

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)

      // Check for common errors
      if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
        return NextResponse.json({
          error: 'Storage bucket "products" not found. Please create it in Supabase Dashboard > Storage.'
        }, { status: 500 })
      }

      if (uploadError.message?.includes('policy') || uploadError.message?.includes('permission')) {
        return NextResponse.json({
          error: 'Storage permission denied. Please check bucket policies in Supabase.'
        }, { status: 500 })
      }

      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 })
    }

    return NextResponse.json({ url: urlData.publicUrl, path: fileName })
  } catch (err) {
    console.error('Upload error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 })
  }
}
