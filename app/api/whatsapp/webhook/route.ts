import { NextRequest, NextResponse } from 'next/server'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!

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
        const from = message.from // sender phone number
        const type = message.type
        const timestamp = message.timestamp

        console.log(`Message from ${from}: type=${type}`)

        if (type === 'text') {
          const text = message.text?.body ?? ''
          console.log(`Text: ${text}`)
          await sendWhatsAppMessage(from, getAutoReply(text))
        }
      }
    }
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

function getAutoReply(incomingText: string): string {
  const text = incomingText.toLowerCase().trim()

  if (text.includes('hola') || text.includes('hi') || text.includes('hello')) {
    return '¡Hola! Bienvenido a ObraKit. Somos la plataforma para subcontratistas de construcción. ¿En qué te puedo ayudar?\n\n1. Quiero saber más sobre ObraKit\n2. Necesito soporte técnico\n3. Quiero hablar con un asesor'
  }

  if (text === '1') {
    return 'ObraKit te ayuda a manejar tus proyectos de construcción, lien waivers, pagos y más — todo desde una sola plataforma. ¿Te gustaría agendar una demo?'
  }

  if (text === '2') {
    return 'Para soporte técnico, describe tu problema y un agente te contactará pronto.'
  }

  if (text === '3') {
    return 'Un asesor de ventas te contactará en breve. ¿Cuál es tu nombre y el nombre de tu empresa?'
  }

  return 'Gracias por tu mensaje. Un miembro de nuestro equipo te responderá pronto. Mientras tanto, escribe "hola" para ver nuestras opciones.'
}

async function sendWhatsAppMessage(to: string, text: string) {
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Failed to send WhatsApp message:', error)
  }

  return response
}
