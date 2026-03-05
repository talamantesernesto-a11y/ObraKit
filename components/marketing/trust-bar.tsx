import { getTranslations } from 'next-intl/server'
import { MapPin, FileText, Shield, Globe } from 'lucide-react'

export async function TrustBar() {
  const t = await getTranslations('landing')

  const items = [
    { icon: MapPin, label: t('trustStates') },
    { icon: FileText, label: t('trustWaiverTypes') },
    { icon: Shield, label: t('trustAi') },
    { icon: Globe, label: t('trustBilingual') },
  ]

  return (
    <section className="border-b border-warm-gray bg-warm-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange/10">
                  <Icon className="h-5 w-5 text-orange" />
                </div>
                <span className="text-sm font-semibold text-navy">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
