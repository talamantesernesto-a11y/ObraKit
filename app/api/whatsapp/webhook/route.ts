import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateLead, handleMessage, updateLead, logMessage } from '@/lib/whatsapp/conversation'
import { sendWhatsAppMessage } from '@/lib/whatsapp/send'
import { MESSAGES } from '@/lib/whatsapp/messages'
import { validateTwilioSignature } from '@/lib/whatsapp/validate'

// POST - Receive incoming messages from Twilio
// Twilio sends form-urlencoded data with fields: Body, From, To, MessageSid, etc.
// Docs: https://www.twilio.com/docs/messaging/guides/webhook-request
export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const body = formData.get('Body') as string | null
  const from = formData.get('From') as string | null // e.g. 'whatsapp:+5215512345678'
  const messageSid = formData.get('MessageSid') as string | null
  const numMedia = parseInt(formData.get('NumMedia') as string ?? '0', 10)

  // Validate required fields
  if (!from || !messageSid) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Validate Twilio signature in production
  const isValid = await validateTwilioSignature(request, formData)
  if (!isValid) {
    console.error('Invalid Twilio signature — rejecting request')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  // Extract phone number without 'whatsapp:' prefix for DB storage
  const phone = from.replace('whatsapp:', '')

  await processMessage(phone, body, messageSid, numMedia)

  // Twilio expects a TwiML response or empty 200
  return new Response('<Response></Response>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

async function processMessage(
  phone: string,
  body: string | null,
  messageSid: string,
  numMedia: number
) {
  console.log(`Message from ${phone}: body="${body}", media=${numMedia}`)

  // Get or create lead
  const lead = await getOrCreateLead(phone)

  // Dedup: if this message was already processed (webhook retry), skip
  const text = body ?? ''
  const dedup = await logMessage(lead.id, 'inbound', text || `[media:${numMedia}]`, messageSid)
  if (dedup === 'duplicate') {
    console.log(`Skipping duplicate message: ${messageSid}`)
    return
  }

  // Handle non-text messages (media, location, etc.)
  if (!body && numMedia > 0) {
    await sendWhatsAppMessage(phone, MESSAGES.nonText)
    await logMessage(lead.id, 'outbound', MESSAGES.nonText)
    return
  }

  // Process through state machine
  const { reply, updates } = handleMessage(lead, text)

  // Update lead in DB
  await updateLead(lead.id, updates)

  // Send reply via Twilio
  await sendWhatsAppMessage(phone, reply)
  await logMessage(lead.id, 'outbound', reply)
}
