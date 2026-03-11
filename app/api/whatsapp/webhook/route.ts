import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateLead, handleMessage, updateLead, logMessage } from '@/lib/whatsapp/conversation'
import { sendWhatsAppMessage } from '@/lib/whatsapp/send'
import { MESSAGES } from '@/lib/whatsapp/messages'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!

// GET - Webhook verification (Meta sends this to verify your endpoint)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully')
    return new Response(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// POST - Receive incoming messages
export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.object !== 'whatsapp_business_account') {
    return NextResponse.json({ error: 'Not a WhatsApp event' }, { status: 404 })
  }

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') continue

      const messages = change.value?.messages ?? []
      for (const message of messages) {
        await processMessage(message)
      }
    }
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

async function processMessage(message: any) {
  const from = message.from
  const type = message.type
  const waMessageId = message.id

  console.log(`Message from ${from}: type=${type}`)

  // Get or create lead
  const lead = await getOrCreateLead(from)

  // Dedup: if this message was already processed (webhook retry), skip
  const dedup = await logMessage(lead.id, 'inbound', message.text?.body ?? `[${type}]`, waMessageId)
  if (dedup === 'duplicate') {
    console.log(`Skipping duplicate message: ${waMessageId}`)
    return
  }

  // Handle non-text messages
  if (type !== 'text') {
    await sendWhatsAppMessage(from, MESSAGES.nonText)
    await logMessage(lead.id, 'outbound', MESSAGES.nonText)
    return
  }

  const text = message.text?.body ?? ''
  console.log(`Text: ${text}`)

  // Process through state machine
  const { reply, updates } = handleMessage(lead, text)

  // Update lead in DB
  await updateLead(lead.id, updates)

  // Send reply
  await sendWhatsAppMessage(from, reply)
  await logMessage(lead.id, 'outbound', reply)
}
