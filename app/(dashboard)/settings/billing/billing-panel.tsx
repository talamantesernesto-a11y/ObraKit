'use client'

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { useState, useEffect } from 'react'
import { CreditCard, Zap, Check } from 'lucide-react'

interface BillingPanelProps {
  plan: string
  planStatus: string
  hasStripeCustomer: boolean
  waiverUsage: number
  waiverLimit: number | null
}

export function BillingPanel({
  plan,
  planStatus,
  hasStripeCustomer,
  waiverUsage,
  waiverLimit,
}: BillingPanelProps) {
  const t = useTranslations('billing')
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast(t('subscriptionSuccess'), 'success')
    } else if (searchParams.get('canceled') === 'true') {
      toast(t('subscriptionCanceled'), 'error')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckout = async (targetPlan: 'pro') => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: targetPlan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      toast(t('checkoutError'), 'error')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      toast(t('portalError'), 'error')
    } finally {
      setPortalLoading(false)
    }
  }

  const planLabel = t(plan as 'free' | 'pro')
  const price = plan === 'free' ? '$0' : '$29'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">{t('title')}</h1>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('currentPlan')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-xl font-bold text-navy">{planLabel}</p>
              <Badge variant={planStatus === 'active' ? 'signed' : 'draft'}>
                {planStatus}
              </Badge>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-navy">{price}</span>
              <span className="text-sm text-warm-dark">/{t('month')}</span>
            </div>
          </div>

          {/* Usage bar (free plan only) */}
          {waiverLimit && (
            <div>
              <p className="text-sm text-warm-dark">{t('waiverUsage')}</p>
              <div className="mt-1 h-2 rounded-full bg-warm-gray">
                <div
                  className="h-2 rounded-full bg-orange transition-all"
                  style={{ width: `${Math.min((waiverUsage / waiverLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-warm-dark">
                {waiverUsage} / {waiverLimit} {t('waiversUsed')}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {plan === 'free' ? (
              <Button variant="accent" onClick={() => handleCheckout('pro')} loading={checkoutLoading}>
                <Zap className="h-4 w-4" />
                {t('upgradeToPro')}
              </Button>
            ) : hasStripeCustomer ? (
              <Button variant="outline" onClick={handlePortal} loading={portalLoading}>
                {t('manageSubscription')}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Why upgrade (free users only) */}
      {plan === 'free' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('whyUpgrade')}</CardTitle>
            <CardDescription>{t('whyUpgradeDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(['unlimitedWaivers', 'unlimitedProjects', 'cleanPdf', 'prioritySupport'] as const).map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-warm-dark">
                  <Check className="h-4 w-4 flex-shrink-0 text-risk-low" />
                  {t(feature)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
