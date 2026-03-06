import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MapPin, ArrowRight, Scale, FileText } from 'lucide-react'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import { getSlugFromState } from '@/lib/waivers/state-slugs'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('stateGuides')
  return {
    title: t('indexMetaTitle'),
    description: t('indexMetaDescription'),
    openGraph: {
      title: t('indexMetaTitle'),
      description: t('indexMetaDescription'),
      url: 'https://obrakit.ai/lien-waivers',
      siteName: 'ObraKit',
      type: 'website',
    },
    alternates: {
      canonical: 'https://obrakit.ai/lien-waivers',
    },
  }
}

export default async function LienWaiversIndexPage() {
  const t = await getTranslations('stateGuides')
  const states = Object.values(STATE_RULES)

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
            <li className="font-medium text-white/90">{t('breadcrumbIndex')}</li>
          </ol>
        </nav>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('indexTitle')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {t('indexSubtitle')}
          </p>
        </div>
      </section>

      {/* State Cards */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {states.map((state) => {
              const slug = getSlugFromState(state.state)
              return (
                <Link
                  key={state.state}
                  href={`/lien-waivers/${slug}`}
                  className="group rounded-xl border border-warm-gray bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-orange/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange/10">
                      <MapPin className="h-6 w-6 text-orange" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-navy">{state.stateName}</h2>
                      <span className="text-xs text-warm-dark">{state.state}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className={cn(
                      'inline-block rounded-full px-3 py-1 text-xs font-medium',
                      state.hasStatutoryForm
                        ? 'bg-risk-low/10 text-risk-low'
                        : 'bg-orange/10 text-orange'
                    )}>
                      {state.hasStatutoryForm ? t('statutory').split(' (')[0] : t('template').split('-')[0].trim()}
                    </span>
                    <span className="inline-block rounded-full bg-warm-white px-3 py-1 text-xs font-medium text-warm-dark">
                      {t('waiverTypesAvailable', { count: state.waiverTypes.length })}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-warm-dark">
                    <Scale className="h-4 w-4" />
                    {state.statuteReference}
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-sm font-medium text-orange group-hover:gap-2 transition-all">
                    {t('viewGuide')}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              )
            })}
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
              { '@type': 'ListItem', position: 2, name: 'Lien Waiver State Guides', item: 'https://obrakit.ai/lien-waivers' },
            ],
          }),
        }}
      />

      {/* JSON-LD: ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Lien Waiver State Guides',
            itemListElement: states.map((state, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://obrakit.ai/lien-waivers/${getSlugFromState(state.state)}`,
              name: state.stateName,
            })),
          }),
        }}
      />
    </>
  )
}
