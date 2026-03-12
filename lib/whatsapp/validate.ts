import { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!

/**
 * Validate that an incoming request is genuinely from Twilio.
 * Uses X-Twilio-Signature header + HMAC-SHA1 validation.
 * Docs: https://www.twilio.com/docs/usage/security#validating-requests
 *
 * In development, skips validation if TWILIO_AUTH_TOKEN is not set.
 */
export async function validateTwilioSignature(
  request: NextRequest,
  formData: FormData
): Promise<boolean> {
  // Skip validation in development if token not configured
  if (!TWILIO_AUTH_TOKEN || process.env.NODE_ENV === 'development') {
    return true
  }

  const signature = request.headers.get('x-twilio-signature')
  if (!signature) return false

  // Build the full URL Twilio used to reach this endpoint
  const url = request.url

  // Sort form parameters alphabetically and concatenate key+value
  const params: Record<string, string> = {}
  formData.forEach((value, key) => {
    params[key] = value as string
  })

  const sortedKeys = Object.keys(params).sort()
  const dataString = sortedKeys.reduce(
    (acc, key) => acc + key + params[key],
    url
  )

  // Compute HMAC-SHA1 using Auth Token
  const computed = createHmac('sha1', TWILIO_AUTH_TOKEN)
    .update(dataString)
    .digest('base64')

  // Use timingSafeEqual to prevent timing attacks
  const computedBuf = Buffer.from(computed)
  const signatureBuf = Buffer.from(signature)
  if (computedBuf.length !== signatureBuf.length) return false
  return timingSafeEqual(computedBuf, signatureBuf)
}
