'use server'

import { createClient } from '@/lib/supabase/server'
import { companySchema } from '@/lib/validations/company'
import { revalidatePath } from 'next/cache'

export async function upsertCompany(data: Record<string, unknown>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const parsed = companySchema.parse(data)

  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('companies')
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('companies')
      .insert({ ...parsed, user_id: user.id })
    if (error) throw error
  }

  revalidatePath('/settings')
  revalidatePath('/')
  return { success: true }
}
