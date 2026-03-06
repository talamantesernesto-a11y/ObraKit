import { createClient } from '@/lib/supabase/server'
import { waiverSchema } from '@/lib/validations/waiver'
import { generateWaiverPdf, type WaiverPdfData } from '@/lib/waivers/generate-pdf'
import { uploadWaiverPdf } from '@/lib/waivers/storage'
import { canCreateWaiver, shouldWatermark } from '@/lib/stripe/plan-limits'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = waiverSchema.parse(body)

    // Get company
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'No company profile' }, { status: 400 })
    }

    // Plan enforcement: check waiver limit
    const waiverCheck = canCreateWaiver(company)
    if (!waiverCheck.allowed) {
      return NextResponse.json({
        error: 'Waiver limit reached',
        code: 'WAIVER_LIMIT',
        current: waiverCheck.current,
        limit: waiverCheck.limit,
      }, { status: 403 })
    }

    // Get project with GC
    const { data: project } = await supabase
      .from('projects')
      .select('*, general_contractors(*)')
      .eq('id', parsed.project_id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Insert waiver record
    const { data: waiver, error: insertError } = await supabase
      .from('waivers')
      .insert({
        project_id: parsed.project_id,
        company_id: company.id,
        waiver_type: parsed.waiver_type,
        state: project.state,
        amount: parsed.amount,
        through_date: parsed.through_date,
        check_maker: parsed.check_maker || null,
        check_amount: parsed.check_amount || null,
        exceptions: parsed.exceptions || null,
        status: 'draft',
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Increment waiver count (with lazy monthly reset)
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const resetAt = company.waiver_count_reset_at ? new Date(company.waiver_count_reset_at) : new Date(0)
    const needsReset = resetAt < firstOfMonth

    await supabase
      .from('companies')
      .update({
        waiver_count_this_month: needsReset ? 1 : company.waiver_count_this_month + 1,
        waiver_count_reset_at: needsReset ? firstOfMonth.toISOString() : company.waiver_count_reset_at,
      })
      .eq('id', company.id)

    // Build PDF data
    const gc = project.general_contractors as { name: string } | null
    const pdfData: WaiverPdfData = {
      waiverType: parsed.waiver_type,
      state: project.state,
      claimantName: company.name,
      claimantAddress: [company.address_line1, company.city, company.state, company.zip]
        .filter(Boolean)
        .join(', '),
      customerName: gc?.name || 'N/A',
      jobLocation: [project.address, project.city, project.state, project.zip]
        .filter(Boolean)
        .join(', '),
      ownerName: project.owner_name || 'N/A',
      throughDate: parsed.through_date,
      amount: parsed.amount,
      checkMaker: parsed.check_maker || undefined,
      checkAmount: parsed.check_amount || undefined,
      exceptions: parsed.exceptions || undefined,
      signatureDate: new Date().toISOString().split('T')[0],
      signatureImage: parsed.signature_image || undefined,
      showWatermark: shouldWatermark(company.plan),
    }

    // Generate PDF
    const pdfBuffer = await generateWaiverPdf(pdfData)

    // Upload to storage
    const pdfUrl = await uploadWaiverPdf(company.id, waiver.id, pdfBuffer)

    // Update waiver with PDF URL and status
    const hasSig = !!parsed.signature_image
    await supabase
      .from('waivers')
      .update({
        pdf_url: pdfUrl,
        status: hasSig ? 'signed' : 'generated',
        ...(hasSig ? { signed_at: new Date().toISOString() } : {}),
      })
      .eq('id', waiver.id)

    return NextResponse.json({ waiverId: waiver.id, pdfUrl })
  } catch (error) {
    console.error('Waiver generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate waiver' },
      { status: 500 }
    )
  }
}
