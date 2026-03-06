'use server'

import { createClient } from '@/lib/supabase/server'
import { projectSchema } from '@/lib/validations/project'
import { canCreateProject } from '@/lib/stripe/plan-limits'
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

export async function createProject(data: Record<string, unknown>) {
  const { supabase, companyId } = await getCompanyId()
  const parsed = projectSchema.parse(data)

  // Plan enforcement: check project limit
  const { data: company } = await supabase
    .from('companies')
    .select('plan, waiver_count_this_month, waiver_count_reset_at')
    .eq('id', companyId)
    .single()

  if (company) {
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('status', 'active')

    const projectCheck = canCreateProject(company, count || 0)
    if (!projectCheck.allowed) {
      throw new Error('PROJECT_LIMIT')
    }
  }

  const insertData = {
    ...parsed,
    company_id: companyId,
    gc_id: parsed.gc_id || null,
    contract_value: parsed.contract_value || null,
    start_date: parsed.start_date || null,
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert(insertData)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/projects')
  revalidatePath('/')
  return { id: project.id }
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  const { supabase } = await getCompanyId()
  const parsed = projectSchema.parse(data)

  const { error } = await supabase
    .from('projects')
    .update({ ...parsed, gc_id: parsed.gc_id || null, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error

  revalidatePath(`/projects/${id}`)
  revalidatePath('/projects')
  revalidatePath('/')
  return { success: true }
}
