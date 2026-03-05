import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export async function PricingPreview() {
  const t = await getTranslations('landing')

  const plans = [
    {
      name: t('pricingFree'),
      price: '$0',
      cta: t('pricingFreeCta'),
      ctaLink: '/signup',
      ctaEnabled: true,
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
      badge: t('pricingMostPopular'),
      cta: t('pricingProCta'),
      ctaLink: '#',
      ctaEnabled: false,
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
      cta: t('pricingTeamCta'),
      ctaLink: '#',
      ctaEnabled: false,
      highlighted: false,
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
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            {t('pricingTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-dark">
            {t('pricingSubtitle')}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl bg-white p-8',
                plan.highlighted
                  ? 'border-2 border-orange shadow-lg'
                  : 'border border-warm-gray shadow-sm'
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-orange px-4 py-1 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-navy">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-navy">{plan.price}</span>
                  <span className="text-sm text-warm-dark">/{t('pricingMonth')}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-risk-low" />
                    <span className="text-sm text-warm-dark">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                {plan.ctaEnabled ? (
                  <Link href={plan.ctaLink}>
                    <Button
                      variant={plan.highlighted ? 'accent' : 'default'}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full cursor-not-allowed opacity-60"
                    disabled
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
