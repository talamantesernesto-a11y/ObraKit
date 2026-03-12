import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateLead, updateLead, logMessage } from '@/lib/whatsapp/conversation'
import { sendWhatsAppMessage } from '@/lib/whatsapp/send'
import { MESSAGES } from '@/lib/whatsapp/messages'
import { validateTwilioSignature } from '@/lib/whatsapp/validate'
import { handleMessageHybrid } from '@/lib/whatsapp/ai-conversation-handler'
import { getRecentMessages } from '@/lib/whatsapp/conversation-history'

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

  try {
    await processMessage(phone, body, messageSid, numMedia)
  } catch (error) {
    console.error('processMessage failed:', error instanceof Error ? error.message : error)
    // Still return 200 so Twilio does not retry and cause duplicates
  }

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
  const phoneRedacted = phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
  console.log(`Message from ${phoneRedacted}: media=${numMedia}`)

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

  // Fetch recent messages for AI context
  const recentMessages = await getRecentMessages(lead.id)

  // Process through hybrid AI + state machine handler
  const { reply, updates } = await handleMessageHybrid(lead, text, recentMessages)

  // Update lead in DB
  await updateLead(lead.id, updates)

  // Send reply via Twilio
  await sendWhatsAppMessage(phone, reply)
  await logMessage(lead.id, 'outbound', reply)
}
