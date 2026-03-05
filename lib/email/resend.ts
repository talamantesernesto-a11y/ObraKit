import { Resend } from 'resend'

const FROM_EMAIL = process.env.EMAIL_FROM || 'ObraKit <onboarding@resend.dev>'

function getResendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(key)
}

interface SendWaiverEmailParams {
  to: string
  subject: string
  html: string
  pdfBuffer: Buffer
  pdfFilename: string
}

export async function sendWaiverEmail(params: SendWaiverEmailParams) {
  const resend = getResendClient()
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    html: params.html,
    attachments: [
      {
        filename: params.pdfFilename,
        content: params.pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })

  if (error) throw error
  return data
}
