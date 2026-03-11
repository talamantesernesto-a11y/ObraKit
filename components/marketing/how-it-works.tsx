import { getTranslations } from 'next-intl/server'
import { FolderPlus, FileCheck, Send } from 'lucide-react'

export async function HowItWorks() {
  const t = await getTranslations('landing')

  const steps = [
    {
      number: '1',
      icon: FolderPlus,
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      number: '2',
      icon: FileCheck,
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      number: '3',
      icon: Send,
      title: t('step3Title'),
      description: t('step3Description'),
    },
  ]

  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            {t('howItWorksTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-dark">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-warm-gray md:block" />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative text-center">
                  {/* Number badge with icon */}
                  <div className="relative mx-auto mb-6 flex h-32 w-32 flex-col items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange/10">
                      <Icon className="h-8 w-8 text-orange" />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange text-sm font-bold text-white shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="font-display text-xl font-semibold text-navy">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-warm-dark">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
