import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export async function Footer() {
  const t = await getTranslations('landing')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-dark">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top: Logo + columns */}
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Logo column */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-white">Obra</span>
              <span className="text-orange">Kit</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              {t('footerTagline')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
              {t('footerProduct')}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#funciones"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  {t('footerFeatures')}
                </a>
              </li>
              <li>
                <a
                  href="#precios"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  {t('footerPricing')}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  {t('footerFaq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
              {t('footerLegal')}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-white/50">{t('footerTerms')}</span>
              </li>
              <li>
                <span className="text-sm text-white/50">{t('footerPrivacy')}</span>
              </li>
              <li>
                <span className="text-sm text-white/50">{t('footerCookies')}</span>
              </li>
            </ul>
          </div>

          {/* States */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
              {t('footerStates')}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/lien-waivers/california" className="text-sm text-white/50 transition-colors hover:text-white">
                  {t('footerCalifornia')}
                </Link>
              </li>
              <li>
                <Link href="/lien-waivers/georgia" className="text-sm text-white/50 transition-colors hover:text-white">
                  {t('footerGeorgia')}
                </Link>
              </li>
              <li>
                <Link href="/lien-waivers/texas" className="text-sm text-white/50 transition-colors hover:text-white">
                  {t('footerTexas')}
                </Link>
              </li>
              <li>
                <Link href="/lien-waivers/florida" className="text-sm text-white/50 transition-colors hover:text-white">
                  {t('footerFlorida')}
                </Link>
              </li>
              <li>
                <Link href="/lien-waivers/new-york" className="text-sm text-white/50 transition-colors hover:text-white">
                  {t('footerNewYork')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
              {t('footerContact')}
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:info@obrakit.ai"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  {t('footerEmail')}
                </a>
              </li>
              <li>
                <span className="text-sm text-white/50">{t('footerSupport')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/40">
            {t('footerCopyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  )
}
