// Twilio WhatsApp API — sends messages via Twilio REST API
// Docs: https://www.twilio.com/docs/whatsapp/api

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER! // e.g. 'whatsapp:+18327431479'

export async function sendWhatsAppMessage(to: string, text: string) {
  // Ensure the 'to' number has the whatsapp: prefix
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

  const body = new URLSearchParams({
    From: TWILIO_WHATSAPP_NUMBER,
    To: toFormatted,
    Body: text,
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Failed to send WhatsApp message:', error)
  }

  return response
}
