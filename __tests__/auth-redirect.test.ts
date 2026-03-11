import { describe, it, expect } from 'vitest'

/**
 * Tests the open redirect prevention logic from auth callback.
 * Extracted for unit testing without Next.js runtime.
 */
function sanitizeRedirectPath(rawNext: string | null): string {
  const next = rawNext ?? '/'
  return next.startsWith('/') && !next.startsWith('//') ? next : '/'
}

describe('Auth Callback — Open Redirect Prevention', () => {
  it('allows normal relative paths', () => {
    expect(sanitizeRedirectPath('/dashboard')).toBe('/dashboard')
  })

  it('allows nested paths', () => {
    expect(sanitizeRedirectPath('/projects/123')).toBe('/projects/123')
  })

  it('allows root path', () => {
    expect(sanitizeRedirectPath('/')).toBe('/')
  })

  it('defaults null to root', () => {
    expect(sanitizeRedirectPath(null)).toBe('/')
  })

  it('blocks protocol-relative URLs (//evil.com)', () => {
    expect(sanitizeRedirectPath('//evil.com')).toBe('/')
  })

  it('blocks absolute URLs', () => {
    expect(sanitizeRedirectPath('https://evil.com')).toBe('/')
  })

  it('blocks URLs without protocol', () => {
    expect(sanitizeRedirectPath('evil.com/login')).toBe('/')
  })

  it('blocks javascript: protocol', () => {
    expect(sanitizeRedirectPath('javascript:alert(1)')).toBe('/')
  })

  it('blocks data: protocol', () => {
    expect(sanitizeRedirectPath('data:text/html,<script>alert(1)</script>')).toBe('/')
  })

  it('allows paths with query params', () => {
    expect(sanitizeRedirectPath('/dashboard?tab=waivers')).toBe('/dashboard?tab=waivers')
  })

  it('allows paths with hash', () => {
    expect(sanitizeRedirectPath('/settings#billing')).toBe('/settings#billing')
  })
})
