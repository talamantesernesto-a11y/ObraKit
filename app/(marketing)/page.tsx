import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getTranslations } from 'next-intl/server'
import { Hero } from '@/components/marketing/hero'
import { TrustBar } from '@/components/marketing/trust-bar'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Features } from '@/components/marketing/features'
import { Testimonials } from '@/components/marketing/testimonials'
import { VideoTestimonial } from '@/components/marketing/video-testimonial'
import { StateCompliance } from '@/components/marketing/state-compliance'
import { CtaFinal } from '@/components/marketing/cta-final'
import { StructuredData } from '@/components/marketing/structured-data'

const PricingPreview = dynamic(() =>
  import('@/components/marketing/pricing-preview').then((mod) => ({ default: mod.PricingPreview }))
)
const Faq = dynamic(() =>
  import('@/components/marketing/faq').then((mod) => ({ default: mod.Faq }))
)
const StickyMobileCta = dynamic(() =>
  import('@/components/marketing/sticky-mobile-cta').then((mod) => ({ default: mod.StickyMobileCta }))
)

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('landing')

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://obrakit.ai',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: 'https://obrakit.ai',
      siteName: 'ObraKit',
      type: 'website',
      locale: 'es_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
  }
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Suspense>
        <TrustBar />
      </Suspense>
      <Suspense>
        <HowItWorks />
      </Suspense>
      <Suspense>
        <Features />
      </Suspense>
      <Suspense>
        <Testimonials />
      </Suspense>
      <Suspense>
        <VideoTestimonial />
      </Suspense>
      <Suspense>
        <StateCompliance />
      </Suspense>
      <PricingPreview />
      <Faq />
      <Suspense>
        <CtaFinal />
      </Suspense>
      <StructuredData />
      <StickyMobileCta />
    </>
  )
}
