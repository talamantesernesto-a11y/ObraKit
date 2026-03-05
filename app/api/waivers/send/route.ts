import { createClient } from '@/lib/supabase/server'
import { sendWaiverEmail } from '@/lib/email/resend'
import { generateWaiverEmailHtml } from '@/lib/email/waiver-email-template'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const sendSchema = z.object({
  waiver_id: z.string().uuid(),
})

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { waiver_id } = sendSchema.parse(body)

    // Get waiver with project and GC
    const { data: waiver } = await supabase
      .from('waivers')
      .select('*, projects(*, general_contractors(*))')
      .eq('id', waiver_id)
      .single()

    if (!waiver) {
      return NextResponse.json({ error: 'Waiver not found' }, { status: 404 })
    }

    // Get GC email
    const project = waiver.projects as { name: string; general_contractors: { name: string; contact_email: string | null } | null } | null
    const gc = project?.general_contractors
    const gcEmail = gc?.contact_email

    if (!gcEmail) {
      return NextResponse.json({ error: 'GC has no email' }, { status: 400 })
    }

    // Get company
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('id', waiver.company_id)
      .single()

    // Download PDF from storage
    const filePath = `${waiver.company_id}/${waiver.id}.pdf`
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('waivers')
      .download(filePath)

    if (downloadError) throw downloadError
    const pdfBuffer = Buffer.from(await pdfData.arrayBuffer())

    // Get waiver type name
    const waiverType = WAIVER_TYPES[waiver.waiver_type as keyof typeof WAIVER_TYPES]
    const amountFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(waiver.amount)

    // Generate email
    const html = generateWaiverEmailHtml({
      claimantName: company?.name || '',
      gcName: gc?.name || '',
      projectName: project?.name || '',
      waiverTypeName: waiverType?.name_en || waiver.waiver_type,
      amount: amountFormatted,
      throughDate: waiver.through_date,
    })

    // Send via Resend
    await sendWaiverEmail({
      to: gcEmail,
      subject: `Lien Waiver — ${project?.name} — ${company?.name}`,
      html,
      pdfBuffer,
      pdfFilename: `waiver-${waiver.id.slice(0, 8)}.pdf`,
    })

    // Update waiver status
    await supabase
      .from('waivers')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_to_email: gcEmail,
      })
      .eq('id', waiver_id)

    return NextResponse.json({ success: true, sentTo: gcEmail })
  } catch (error) {
    console.error('Send waiver error:', error)
    return NextResponse.json(
      { error: 'Failed to send waiver' },
      { status: 500 }
    )
  }
}
