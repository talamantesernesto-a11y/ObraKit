export type PlanId = 'free' | 'pro'

export interface PlanConfig {
  id: PlanId
  stripePriceId: string | null
  waiverLimit: number | null
  projectLimit: number | null
  hasWatermark: boolean
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    stripePriceId: null,
    waiverLimit: 3,
    projectLimit: 1,
    hasWatermark: true,
  },
  pro: {
    id: 'pro',
    stripePriceId: process.env.STRIPE_PRICE_PRO || null,
    waiverLimit: null,
    projectLimit: null,
    hasWatermark: false,
  },
}

/** Given a Stripe price ID, return the plan ID */
export function planIdFromPriceId(priceId: string): PlanId | null {
  for (const [id, config] of Object.entries(PLANS)) {
    if (config.stripePriceId === priceId) return id as PlanId
  }
  return null
}
