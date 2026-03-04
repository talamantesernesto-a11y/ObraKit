'use server'

import { createClient } from '@/lib/supabase/server'
import { contractorSchema } from '@/lib/validations/contractor'
import { revalidatePath } from 'next/cache'

async function getCompanyId() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!company) throw new Error('No company profile')
  return { supabase, companyId: company.id }
}

export async function createContractor(data: Record<string, unknown>) {
  const { supabase, companyId } = await getCompanyId()
  const parsed = contractorSchema.parse(data)

  const { data: gc, error } = await supabase
    .from('general_contractors')
    .insert({ ...parsed, company_id: companyId })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/general-contractors')
  return { id: gc.id }
}

export async function updateContractor(id: string, data: Record<string, unknown>) {
  const { supabase } = await getCompanyId()
  const parsed = contractorSchema.parse(data)

  const { error } = await supabase
    .from('general_contractors')
    .update(parsed)
    .eq('id', id)

  if (error) throw error

  revalidatePath(`/general-contractors/${id}`)
  revalidatePath('/general-contractors')
  return { success: true }
}
