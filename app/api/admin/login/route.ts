import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const FALLBACK_PASSWORD = 'auparts2026'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const adminPassword = (process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD).trim()
  const inputPassword = (password || '').trim()

  if (inputPassword === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
