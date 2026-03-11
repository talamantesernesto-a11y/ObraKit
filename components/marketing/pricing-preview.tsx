'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, AlertTriangle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PricingPreview() {
  const t = useTranslations('landing')
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: t('pricingFree'),
      price: '$0',
      annualPrice: '$0',
      period: t('pricingMonth'),
      cta: t('pricingFreeCta'),
      ctaLink: '/signup',
      highlighted: false,
      features: [
        t('pricingFreeFeature1'),
        t('pricingFreeFeature2'),
        t('pricingFreeFeature3'),
        t('pricingFreeFeature4'),
        t('pricingFreeFeature5'),
      ],
    },
    {
      name: t('pricingPro'),
      price: '$29',
      annualPrice: '$23',
      period: t('pricingMonth'),
      badge: t('pricingMostPopular'),
      cta: t('pricingProCta'),
      ctaLink: '/signup',
      highlighted: true,
      features: [
        t('pricingProFeature1'),
        t('pricingProFeature2'),
        t('pricingProFeature3'),
        t('pricingProFeature4'),
        t('pricingProFeature5'),
      ],
    },
    {
      name: t('pricingTeam'),
      price: '$79',
      annualPrice: '$63',
      period: t('pricingMonth'),
      cta: t('pricingTeamCta'),
      ctaLink: '#',
      highlighted: false,
      comingSoon: true,
      features: [
        t('pricingTeamFeature1'),
        t('pricingTeamFeature2'),
        t('pricingTeamFeature3'),
        t('pricingTeamFeature4'),
        t('pricingTeamFeature5'),
      ],
    },
  ]

  return (
    <section id="precios" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            {t('pricingTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-dark">
            {t('pricingSubtitle')}
          </p>
        </div>

        {/* Value framing */}
        <div className="mx-auto mt-8 flex max-w-xl items-start gap-3 rounded-xl border border-orange/20 bg-orange/5 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange" />
          <p className="text-sm leading-relaxed text-navy/80">
            {t('pricingValueFrame')}
          </p>
        </div>

        {/* Annual/Monthly toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={cn('text-sm font-medium', !annual ? 'text-navy' : 'text-warm-dark')}>
            {t('pricingMonthly')}
          </span>
          <button
            role="switch"
            aria-checked={annual}
            aria-label={t('pricingToggleLabel')}
            onClick={() => setAnnual(!annual)}
            className={cn(
              'relative h-7 w-12 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2',
              annual ? 'bg-orange' : 'bg-warm-gray'
            )}
          >
            <div
              className={cn(
                'absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200',
                annual && 'translate-x-5'
              )}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn('text-sm font-medium', annual ? 'text-navy' : 'text-warm-dark')}>
              {t('pricingAnnual')}
            </span>
            {annual && (
              <span className="rounded-full bg-risk-low/10 px-2.5 py-0.5 text-xs font-semibold text-risk-low">
                {t('pricingSavePercent')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl p-7',
                plan.highlighted
                  ? 'border-2 border-orange bg-white shadow-xl shadow-orange/10 lg:-mt-4 lg:mb-[-16px] lg:pb-11 lg:pt-9'
                  : 'border border-warm-gray bg-white shadow-sm'
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-orange px-4 py-1 text-xs font-bold text-white shadow-lg shadow-orange/20">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan info */}
              <div className="text-center">
                <h3 className="font-display text-lg font-semibold text-navy">{plan.name}</h3>
                <div className="mt-3">
                  <span className="font-display text-4xl font-bold text-navy">
                    {annual ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-sm text-warm-dark">/{plan.period}</span>
                </div>
                {annual && plan.price !== '$0' && (
                  <div className="mt-1 text-xs text-warm-dark line-through">
                    {plan.price}/{plan.period}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="mt-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={cn(
                      'mt-0.5 h-4 w-4 flex-shrink-0',
                      plan.highlighted ? 'text-orange' : 'text-risk-low'
                    )} />
                    <span className="text-sm text-navy/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-7">
                {plan.comingSoon ? (
                  <Button
                    variant="outline"
                    className="w-full cursor-not-allowed opacity-60"
                    disabled
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <Link href={plan.ctaLink}>
                    <Button
                      variant={plan.highlighted ? 'accent' : 'default'}
                      className="w-full"
                    >
                      {plan.cta}
                      {plan.highlighted && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Guarantee */}
              {plan.highlighted && (
                <p className="mt-4 text-center text-xs text-warm-dark">
                  {t('pricingGuarantee')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
