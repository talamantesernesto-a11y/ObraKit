import { getTranslations } from 'next-intl/server'
import { Scale, ShieldCheck, PenTool, Mail, Languages, Lock } from 'lucide-react'

export async function Features() {
  const t = await getTranslations('landing')

  const features = [
    {
      icon: Scale,
      title: t('feature1Title'),
      description: t('feature1Description'),
    },
    {
      icon: ShieldCheck,
      title: t('feature2Title'),
      description: t('feature2Description'),
    },
    {
      icon: PenTool,
      title: t('feature3Title'),
      description: t('feature3Description'),
    },
    {
      icon: Mail,
      title: t('feature4Title'),
      description: t('feature4Description'),
    },
    {
      icon: Languages,
      title: t('feature5Title'),
      description: t('feature5Description'),
    },
    {
      icon: Lock,
      title: t('feature6Title'),
      description: t('feature6Description'),
    },
  ]

  return (
    <section id="funciones" className="bg-warm-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            {t('featuresTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-dark">
            {t('featuresSubtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="rounded-xl bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10">
                  <Icon className="h-6 w-6 text-orange" />
                </div>
                <h3 className="text-lg font-semibold text-navy">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-dark">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
