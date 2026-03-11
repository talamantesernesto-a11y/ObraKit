import { getTranslations } from 'next-intl/server'

export async function StructuredData() {
  const t = await getTranslations('landing')

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ObraKit',
    url: 'https://obrakit.ai',
    logo: 'https://obrakit.ai/icon-512.png',
    description: t('metaDescription'),
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@obrakit.ai',
      contactType: 'customer support',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [],
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ObraKit',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://obrakit.ai',
    description: t('metaDescription'),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free trial available',
    },
    inLanguage: ['es', 'en'],
    featureList: [
      'Lien waiver generation',
      'Electronic signatures',
      'State-specific compliance',
      'Spanish language support',
      'Mobile-friendly interface',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
    </>
  )
}
