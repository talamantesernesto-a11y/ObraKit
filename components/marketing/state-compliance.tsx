import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { getSlugFromState } from '@/lib/waivers/state-slugs'

export async function StateCompliance() {
  const t = await getTranslations('landing')

  const states = [
    {
      name: t('footerCalifornia'),
      abbr: 'CA',
      badge: t('stateStatutory'),
      types: 4,
      statutory: true,
    },
    {
      name: t('footerGeorgia'),
      abbr: 'GA',
      badge: t('stateStatutory'),
      types: 2,
      statutory: true,
    },
    {
      name: t('footerTexas'),
      abbr: 'TX',
      badge: t('stateTemplate'),
      types: 4,
      statutory: false,
    },
    {
      name: t('footerFlorida'),
      abbr: 'FL',
      badge: t('stateTemplate'),
      types: 4,
      statutory: false,
    },
    {
      name: 'New York',
      abbr: 'NY',
      badge: t('stateTemplate'),
      types: 4,
      statutory: false,
    },
  ]

  return (
    <section id="estados" className="bg-navy-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t('statesTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {t('statesSubtitle')}
          </p>
        </div>

        {/* State cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {states.map((state) => (
            <Link
              key={state.abbr}
              href={`/lien-waivers/${getSlugFromState(state.abbr)}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange/20">
                <MapPin className="h-6 w-6 text-orange-light" />
              </div>
              <h3 className="text-lg font-semibold text-white">{state.name}</h3>
              <div className="mt-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    state.statutory
                      ? 'bg-risk-low/20 text-risk-low'
                      : 'bg-orange/20 text-orange-light'
                  }`}
                >
                  {state.badge}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/60">
                {t('stateTypes', { count: state.types })}
              </p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-orange-light opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>

        {/* Coming soon note */}
        <p className="mt-10 text-center text-sm text-white/50">
          {t('statesComingSoon')}
        </p>
      </div>
    </section>
  )
}
