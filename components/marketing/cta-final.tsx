import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle, Users } from 'lucide-react'

export async function CtaFinal() {
  const t = await getTranslations('landing')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-light bg-blueprint">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-orange/10 blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange/5 blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        {/* Social proof counter */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <Users className="h-4 w-4 text-orange" />
          <span className="text-sm font-medium text-white/80">{t('ctaSocialProof')}</span>
        </div>

        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {t('ctaTitle')}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
          {t('ctaSubtitle')}
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/signup">
            <Button variant="accent" size="lg" className="w-full text-base sm:w-auto">
              {t('ctaCta')}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <a
            href="https://wa.me/13393312827?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20ObraKit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              {t('ctaWhatsapp')}
            </Button>
          </a>
        </div>

        {/* Trust note */}
        <p className="mt-6 text-sm text-white/40">{t('ctaTrustNote')}</p>
      </div>
    </section>
  )
}
