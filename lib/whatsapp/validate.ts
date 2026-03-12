import { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!

/**
 * Validate that an incoming request is genuinely from Twilio.
 * Uses X-Twilio-Signature header + HMAC-SHA1 validation.
 * Docs: https://www.twilio.com/docs/usage/security#validating-requests
 *
 * Behind reverse proxies (Vercel, Cloudflare), request.url may not match
 * the public URL that Twilio signed against. We reconstruct the public URL
 * from x-forwarded-proto and host headers.
 */
export async function validateTwilioSignature(
  request: NextRequest,
  formData: FormData
): Promise<boolean> {
  // Skip validation in development
  if (!TWILIO_AUTH_TOKEN || process.env.NODE_ENV === 'development') {
    return true
  }

  const signature = request.headers.get('x-twilio-signature')
  if (!signature) {
    console.error('Twilio validation: missing x-twilio-signature header')
    return false
  }

  // Reconstruct the public URL that Twilio signed against.
  // Behind Vercel/proxies, request.url may have an internal hostname.
  const proto = request.headers.get('x-forwarded-proto') ?? 'https'
  const host = request.headers.get('host') ?? ''
  const pathname = new URL(request.url).pathname
  const publicUrl = `${proto}://${host}${pathname}`

  // Sort form parameters alphabetically and concatenate key+value
  const params: Record<string, string> = {}
  formData.forEach((value, key) => {
    params[key] = value as string
  })

  const sortedKeys = Object.keys(params).sort()
  const dataString = sortedKeys.reduce(
    (acc, key) => acc + key + params[key],
    publicUrl
  )

  // Compute HMAC-SHA1 using Auth Token
  const computed = createHmac('sha1', TWILIO_AUTH_TOKEN)
    .update(dataString)
    .digest('base64')

  // Use timingSafeEqual to prevent timing attacks
  const computedBuf = Buffer.from(computed)
  const signatureBuf = Buffer.from(signature)
  if (computedBuf.length !== signatureBuf.length) {
    console.error(`Twilio validation: signature length mismatch. URL used: ${publicUrl}`)
    return false
  }

  const isValid = timingSafeEqual(computedBuf, signatureBuf)
  if (!isValid) {
    console.error(`Twilio validation: signature mismatch. URL used: ${publicUrl}`)
  }
  return isValid
}
