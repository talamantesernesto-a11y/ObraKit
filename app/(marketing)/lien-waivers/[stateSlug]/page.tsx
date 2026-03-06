import { notFound } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Check, FileText, Scale, Shield, MapPin, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { STATE_RULES, getStateRule } from '@/lib/waivers/state-rules'
import { WAIVER_TYPES, type WaiverTypeId } from '@/lib/waivers/types'
import { getAllStateSlugs, getStateFromSlug } from '@/lib/waivers/state-slugs'
import { cn } from '@/lib/utils'

interface Props {
  params: { stateSlug: string }
}

export function generateStaticParams() {
  return getAllStateSlugs().map((stateSlug) => ({ stateSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateCode = getStateFromSlug(params.stateSlug)
  if (!stateCode) return {}
  const rule = getStateRule(stateCode)!
  const t = await getTranslations('stateGuides')
  return {
    title: t('metaTitle', { stateName: rule.stateName }),
    description: t('metaDescription', { stateName: rule.stateName, statute: rule.statuteReference }),
    openGraph: {
      title: t('metaTitle', { stateName: rule.stateName }),
      description: t('metaDescription', { stateName: rule.stateName, statute: rule.statuteReference }),
      url: `https://obrakit.ai/lien-waivers/${params.stateSlug}`,
      siteName: 'ObraKit',
      type: 'article',
    },
    alternates: {
      canonical: `https://obrakit.ai/lien-waivers/${params.stateSlug}`,
    },
  }
}

const RISK_COLORS: Record<string, string> = {
  low: 'bg-risk-low/10 text-risk-low border-risk-low/20',
  medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
  high: 'bg-risk-high/10 text-risk-high border-risk-high/20',
}

export default async function StateGuidePage({ params }: Props) {
  const stateCode = getStateFromSlug(params.stateSlug)
  if (!stateCode) notFound()
  const rule = getStateRule(stateCode)!
  const t = await getTranslations('stateGuides')
  const locale = await getLocale()

  const faqs = [
    { question: t(`${stateCode}_faq1Question`), answer: t(`${stateCode}_faq1Answer`) },
    { question: t(`${stateCode}_faq2Question`), answer: t(`${stateCode}_faq2Answer`) },
    { question: t(`${stateCode}_faq3Question`), answer: t(`${stateCode}_faq3Answer`) },
  ]

  const waiverTypes = rule.waiverTypes.map((typeId) => ({
    ...WAIVER_TYPES[typeId],
    warningText: rule.warningText[typeId] || null,
  }))

  return (
    <>
      {/* Hero + Breadcrumb (merged so fixed header always has dark bg behind it) */}
      <section className="bg-gradient-to-b from-navy to-navy-dark pt-24 pb-16 sm:pt-28 sm:pb-24">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-white/60">
            <li>
              <Link href="/" className="hover:text-white transition-colors">{t('breadcrumbHome')}</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/lien-waivers" className="hover:text-white transition-colors">{t('breadcrumbIndex')}</Link>
            </li>
            <li>/</li>
            <li className="font-medium text-white/90">{rule.stateName}</li>
          </ol>
        </nav>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto flex items-center justify-center gap-3 mb-6">
            <span className={cn(
              'inline-block rounded-full px-4 py-1.5 text-sm font-medium',
              rule.hasStatutoryForm
                ? 'bg-risk-low/20 text-risk-low'
                : 'bg-orange/20 text-orange-light'
            )}>
              {rule.hasStatutoryForm ? t('statutory') : t('template')}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Lien Waivers — {rule.stateName}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {t('heroSubtitle')}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
            <Scale className="h-4 w-4" />
            {rule.statuteReference}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="bg-warm-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <FileText className="h-6 w-6 text-orange" />
              <p className="mt-3 text-sm text-warm-dark">{t('formType')}</p>
              <p className="mt-1 font-semibold text-navy">
                {rule.hasStatutoryForm ? t('statutory') : t('template')}
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <Shield className="h-6 w-6 text-orange" />
              <p className="mt-3 text-sm text-warm-dark">{t('requiresNotarization')}</p>
              <p className="mt-1 font-semibold text-navy">
                {rule.requiresNotarization ? t('yes') : t('notRequired')}
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <MapPin className="h-6 w-6 text-orange" />
              <p className="mt-3 text-sm text-warm-dark">{t('waiverTypesTitle')}</p>
              <p className="mt-1 font-semibold text-navy">
                {t('waiverTypesCount', { count: rule.waiverTypes.length })}
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <Scale className="h-6 w-6 text-orange" />
              <p className="mt-3 text-sm text-warm-dark">{t('statuteReference')}</p>
              <p className="mt-1 font-semibold text-navy text-sm">{rule.statuteReference}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t('overviewTitle')}</h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-dark">
            {t(`${stateCode}_overview`)}
          </p>
        </div>
      </section>

      {/* Waiver Types */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t('waiverTypesTitle')}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {waiverTypes.map((type) => {
              const name = locale === 'en' ? type.name_en : type.name_es
              const description = locale === 'en' ? type.description_en : type.description_es
              const riskLabel = t(`risk${type.risk_level.charAt(0).toUpperCase()}${type.risk_level.slice(1)}` as 'riskLow' | 'riskMedium' | 'riskHigh')

              return (
                <article
                  key={type.id}
                  className="rounded-xl border border-warm-gray bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-navy">{name}</h3>
                    <span className={cn(
                      'flex-shrink-0 rounded-full border px-3 py-1 text-xs font-medium',
                      RISK_COLORS[type.risk_level]
                    )}>
                      {riskLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-warm-dark">{description}</p>
                  {type.warningText && (
                    <div className="mt-4 rounded-lg bg-risk-medium/5 border border-risk-medium/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-risk-medium mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        {t('warningTextLabel')}
                      </div>
                      <p className="text-xs leading-relaxed text-warm-dark">{type.warningText}</p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Required Fields */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t('requiredFieldsTitle')}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {rule.requiredFields.map((field) => (
              <div key={field} className="flex items-center gap-3 rounded-lg bg-warm-white p-4">
                <Check className="h-5 w-5 flex-shrink-0 text-risk-low" />
                <span className="text-sm font-medium text-navy">{t(`field_${field}` as any)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t('faqTitle')}</h2>
          <div className="mt-10 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-navy">{faq.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-dark">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t('ctaTitle', { stateName: rule.stateName })}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            {t('ctaSubtitle', { stateName: rule.stateName })}
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button variant="accent" size="lg">
                {t('ctaCta')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://obrakit.ai' },
              { '@type': 'ListItem', position: 2, name: 'Lien Waiver Guides', item: 'https://obrakit.ai/lien-waivers' },
              { '@type': 'ListItem', position: 3, name: `${rule.stateName} Lien Waivers`, item: `https://obrakit.ai/lien-waivers/${params.stateSlug}` },
            ],
          }),
        }}
      />

      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
    </>
  )
}
