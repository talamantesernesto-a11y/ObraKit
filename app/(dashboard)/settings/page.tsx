import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CompanyForm } from './company-form'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return <CompanyForm company={company} isSetup={!company} />
}
