import { getTranslations } from 'next-intl/server'
import { FileCheck, Users, MapPin, Shield } from 'lucide-react'
import { AnimatedCounter } from './animated-counter'

export async function TrustBar() {
  const t = await getTranslations('landing')

  const stats = [
    {
      icon: FileCheck,
      value: 2500,
      suffix: '+',
      label: t('trustStat1'),
    },
    {
      icon: Users,
      value: 850,
      suffix: '+',
      label: t('trustStat2'),
    },
    {
      icon: MapPin,
      value: 5,
      suffix: '',
      label: t('trustStat3'),
    },
    {
      icon: Shield,
      value: 99,
      suffix: '%',
      label: t('trustStat4'),
    },
  ]

  return (
    <section className="border-b border-warm-gray bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10">
                  <Icon className="h-5 w-5 text-orange" />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <div className="mt-1 text-sm font-medium text-warm-dark">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
