import { getStripe } from '@/lib/stripe/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { planIdFromPriceId } from '@/lib/stripe/plans'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id
        if (!customerId) break

        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (company) {
          // Get plan from invoice line items (clover API: pricing.price_details.price)
          const lineItem = invoice.lines?.data?.[0]
          const priceRef = lineItem?.pricing?.price_details?.price
          const priceId = typeof priceRef === 'string' ? priceRef : priceRef?.id
          const planId = priceId ? planIdFromPriceId(priceId) : null

          if (planId) {
            await supabase
              .from('companies')
              .update({
                plan: planId,
                plan_status: 'active',
                updated_at: new Date().toISOString(),
              })
              .eq('id', company.id)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.id
        if (!customerId) break

        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (company) {
          const priceId = subscription.items.data[0]?.price?.id
          const planId = priceId ? planIdFromPriceId(priceId) : null
          const status = subscription.status

          await supabase
            .from('companies')
            .update({
              plan: planId || 'free',
              plan_status: status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', company.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.id
        if (!customerId) break

        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (company) {
          await supabase
            .from('companies')
            .update({
              plan: 'free',
              plan_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', company.id)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
