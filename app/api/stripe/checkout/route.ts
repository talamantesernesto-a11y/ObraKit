import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe/stripe'
import { PLANS, type PlanId } from '@/lib/stripe/plans'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const checkoutSchema = z.object({
  plan: z.enum(['pro']),
})

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { plan } = checkoutSchema.parse(body)
    const priceId = PLANS[plan as PlanId].stripePriceId
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const { data: company } = await supabase
      .from('companies')
      .select('id, stripe_customer_id, email, name')
      .eq('user_id', user.id)
      .single()

    if (!company) {
      return NextResponse.json({ error: 'No company profile' }, { status: 400 })
    }

    // Reuse or create Stripe customer
    let customerId = company.stripe_customer_id
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: company.email || user.email || undefined,
        name: company.name,
        metadata: { company_id: company.id, user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('companies')
        .update({ stripe_customer_id: customerId })
        .eq('id', company.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/settings/billing?success=true`,
      cancel_url: `${appUrl}/settings/billing?canceled=true`,
      metadata: { company_id: company.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
