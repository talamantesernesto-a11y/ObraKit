import type { Metadata } from 'next'
import { Hero } from '@/components/marketing/hero'
import { TrustBar } from '@/components/marketing/trust-bar'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Features } from '@/components/marketing/features'
import { StateCompliance } from '@/components/marketing/state-compliance'
import { PricingPreview } from '@/components/marketing/pricing-preview'
import { Faq } from '@/components/marketing/faq'
import { CtaFinal } from '@/components/marketing/cta-final'

export const metadata: Metadata = {
  title: 'ObraKit — Lien Waivers Profesionales para Subcontratistas',
  description:
    'Genera, firma y envia lien waivers que cumplen con la ley de tu estado. En espanol, en minutos, desde cualquier dispositivo. California, Georgia, Texas, Florida y New York.',
  openGraph: {
    title: 'ObraKit — Lien Waivers Profesionales para Subcontratistas',
    description:
      'Genera, firma y envia lien waivers que cumplen con la ley de tu estado. En espanol, en minutos, desde cualquier dispositivo.',
    url: 'https://obrakit.ai',
    siteName: 'ObraKit',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <StateCompliance />
      <PricingPreview />
      <Faq />
      <CtaFinal />
    </>
  )
}
