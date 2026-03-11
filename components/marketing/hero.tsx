import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Star, Shield, FileCheck, Smartphone } from 'lucide-react'

export async function Hero() {
  const t = await getTranslations('landing')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-light bg-blueprint">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange/8 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-orange/5 blur-[80px]" />
        <div className="absolute right-1/4 top-1/3 h-[200px] w-[200px] rounded-full bg-navy-light/20 blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-28 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Copy */}
          <div>
            {/* Social proof pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <div className="flex -space-x-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />
                ))}
              </div>
              <span className="text-xs font-medium text-white/80">
                {t('heroSocialProof')}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70 sm:text-xl">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <Link href="/signup">
                <Button variant="accent" size="lg" className="w-full text-base sm:w-auto">
                  {t('heroCta')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  {t('heroSecondaryCta')}
                </Button>
              </a>
            </div>

            {/* Trust badges inline */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Check className="h-4 w-4 text-risk-low" />
                <span>{t('heroBadge1')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Check className="h-4 w-4 text-risk-low" />
                <span>{t('heroBadge2')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Check className="h-4 w-4 text-risk-low" />
                <span>{t('heroBadge3')}</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive waiver flow mockup */}
          <div className="hidden lg:block" aria-hidden="true">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-8 rounded-3xl bg-orange/8 blur-3xl" />

              {/* Main card — waiver preview */}
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.02] p-1 shadow-2xl backdrop-blur-sm">
                <div className="rounded-xl bg-navy-dark/80 p-6">
                  {/* Header with status */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/20">
                        <FileCheck className="h-5 w-5 text-orange" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t('mockupProjectTitle')}</div>
                        <div className="text-xs text-white/50">{t('mockupWaiverType')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-risk-low/10 px-3 py-1">
                      <Shield className="h-3.5 w-3.5 text-risk-low" />
                      <span className="text-xs font-semibold text-risk-low">{t('mockupStatus')}</span>
                    </div>
                  </div>

                  {/* Waiver details */}
                  <div className="mt-5 space-y-3">
                    <div className="rounded-lg bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-white/40">{t('mockupAmountLabel')}</span>
                        <span className="font-display text-2xl font-bold text-white">$12,500<span className="text-sm text-white/50">.00</span></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white/5 p-3">
                        <span className="text-xs text-white/40">{t('mockupStateLabel')}</span>
                        <div className="mt-1 text-sm font-medium text-white">California</div>
                      </div>
                      <div className="rounded-lg bg-white/5 p-3">
                        <span className="text-xs text-white/40">{t('mockupDateLabel')}</span>
                        <div className="mt-1 text-sm font-medium text-white">Mar 15, 2026</div>
                      </div>
                    </div>

                    {/* AI validation badge */}
                    <div className="flex items-center gap-3 rounded-lg border border-risk-low/20 bg-risk-low/5 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-risk-low/20">
                        <Check className="h-4 w-4 text-risk-low" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-risk-low">{t('mockupAiValidated')}</div>
                        <div className="text-xs text-white/40">{t('mockupAiMessage')}</div>
                      </div>
                    </div>

                    {/* Sign button (decorative mockup) */}
                    <div aria-hidden="true" className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3 text-sm font-semibold text-white">
                      <Smartphone className="h-4 w-4" />
                      {t('mockupSign')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -left-12 bottom-8 animate-float rounded-xl border border-white/10 bg-navy/90 p-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-risk-low/20">
                    <Check className="h-4 w-4 text-risk-low" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t('mockupNotification')}</div>
                    <div className="text-xs text-white/50">{t('mockupNotificationTime')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Compact visual */}
          <div className="lg:hidden" aria-hidden="true">
            <div className="mx-auto max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-orange/20">
                  <FileCheck className="h-7 w-7 text-orange" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t('mockupMobileTitle')}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-risk-low" />
                    <span className="text-xs font-medium text-risk-low">{t('mockupMobileStatus')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <span className="text-xs text-white/50">{t('mockupAmountLabel')}</span>
                <span className="font-display text-lg font-bold text-white">$12,500.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
