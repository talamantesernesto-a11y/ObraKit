import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Shield, FileText } from 'lucide-react'

export async function Hero() {
  const t = await getTranslations('landing')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-light">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-navy-light/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  {t('heroCta')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  {t('heroSecondaryCta')}
                </Button>
              </a>
            </div>

            {/* Badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
              <Check className="h-4 w-4 text-risk-low" />
              {t('heroBadge')}
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-4 rounded-2xl bg-orange/10 blur-2xl" />

              {/* Card mockup */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
                {/* Mockup header */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-white/40">
                    obrakit.ai
                  </div>
                </div>

                {/* Mockup content */}
                <div className="mt-4 space-y-4">
                  {/* Project header */}
                  <div className="rounded-lg bg-white/10 p-4">
                    <div className="text-xs font-medium uppercase tracking-wider text-orange-light">
                      {t('mockupProjectTitle')}
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      {t('mockupWaiverType')}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between rounded-lg bg-white/10 p-4">
                    <span className="text-sm text-white/70">{t('mockupAmount')}</span>
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-risk-low" />
                      <span className="text-xs font-medium text-risk-low">{t('mockupStatus')}</span>
                    </div>
                  </div>

                  {/* Signature area mockup */}
                  <div className="rounded-lg border border-dashed border-white/20 p-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <FileText className="h-4 w-4" />
                      <span>waiver_condicional_pago_parcial.pdf</span>
                    </div>
                  </div>

                  {/* Sign button mockup */}
                  <div className="flex justify-end">
                    <div className="rounded-lg bg-orange px-6 py-2 text-sm font-medium text-white">
                      {t('mockupSign')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
