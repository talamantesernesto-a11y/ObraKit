import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BillingPanel } from './billing-panel'
import { PLANS, type PlanId } from '@/lib/stripe/plans'
import { canCreateWaiver } from '@/lib/stripe/plan-limits'

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!company) redirect('/settings')

  const waiverCheck = canCreateWaiver(company)
  const planConfig = PLANS[(company.plan as PlanId) || 'free']

  return (
    <BillingPanel
      plan={company.plan || 'free'}
      planStatus={company.plan_status || 'active'}
      hasStripeCustomer={!!company.stripe_customer_id}
      waiverUsage={waiverCheck.current}
      waiverLimit={planConfig.waiverLimit}
    />
  )
}
