import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Rate limiting: track failed attempts per IP
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown'
}

function isRateLimited(ip: string): boolean {
  const record = failedAttempts.get(ip)
  if (!record) return false

  // Reset if lockout time has passed
  if (Date.now() - record.lastAttempt > LOCKOUT_TIME) {
    failedAttempts.delete(ip)
    return false
  }

  return record.count >= MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string): void {
  const record = failedAttempts.get(ip)
  if (record) {
    record.count++
    record.lastAttempt = Date.now()
  } else {
    failedAttempts.set(ip, { count: 1, lastAttempt: Date.now() })
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip)
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)

  // Check rate limiting
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many failed attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  // Require ADMIN_PASSWORD to be set in environment
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set')
    return NextResponse.json(
      { error: 'Admin login not configured' },
      { status: 500 }
    )
  }

  const inputPassword = (password || '').trim()

  if (inputPassword === adminPassword.trim()) {
    clearFailedAttempts(ip)
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    return NextResponse.json({ success: true })
  }

  recordFailedAttempt(ip)
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
