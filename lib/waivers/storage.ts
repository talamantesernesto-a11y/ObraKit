import { createAdminClient } from '@/lib/supabase/admin'

export async function uploadWaiverPdf(
  companyId: string,
  waiverId: string,
  pdfBuffer: Buffer
): Promise<string> {
  const supabase = createAdminClient()
  const filePath = `${companyId}/${waiverId}.pdf`

  const { error } = await supabase.storage
    .from('waivers')
    .upload(filePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (error) throw error

  // Use signed URL for private bucket
  const { data } = await supabase.storage
    .from('waivers')
    .createSignedUrl(filePath, 3600) // 1 hour expiry

  if (!data) throw new Error('Failed to create signed URL')
  return data.signedUrl
}

export async function getSignedPdfUrl(filePath: string): Promise<string> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from('waivers')
    .createSignedUrl(filePath, 3600)

  if (error) throw error
  return data.signedUrl
}
