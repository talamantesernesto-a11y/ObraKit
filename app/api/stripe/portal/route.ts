import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: company } = await supabase
      .from('companies')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!company?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await getStripe().billingPortal.sessions.create({
      customer: company.stripe_customer_id,
      return_url: `${appUrl}/settings/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json({ error: 'Failed to create portal' }, { status: 500 })
  }
}
