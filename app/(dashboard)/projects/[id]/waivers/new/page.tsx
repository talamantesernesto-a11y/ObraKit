import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { WizardContainer } from '@/components/waiver-wizard/wizard-container'
import type { Company, Project } from '@/lib/supabase/types'

export default async function NewWaiverPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!company) redirect('/settings')

  const { data: project } = await supabase
    .from('projects')
    .select('*, general_contractors(*)')
    .eq('id', params.id)
    .single()

  if (!project) notFound()

  // Get total previously billed
  const { data: waivers } = await supabase
    .from('waivers')
    .select('amount')
    .eq('project_id', params.id)

  const totalPreviouslyBilled = waivers?.reduce((sum, w) => sum + Number(w.amount), 0) || 0

  return (
    <WizardContainer
      project={project as unknown as Project}
      company={company as unknown as Company}
      totalPreviouslyBilled={totalPreviouslyBilled}
    />
  )
}
