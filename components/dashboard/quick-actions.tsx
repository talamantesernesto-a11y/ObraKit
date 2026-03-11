import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Plus, FileText, Users, Settings } from 'lucide-react'

export async function QuickActions() {
  const t = await getTranslations('dashboard')

  const actions = [
    {
      icon: Plus,
      label: t('quickNewProject'),
      description: t('quickNewProjectDesc'),
      href: '/projects/new',
      color: 'bg-orange/10 text-orange',
    },
    {
      icon: FileText,
      label: t('quickWaivers'),
      description: t('quickWaiversDesc'),
      href: '/waivers',
      color: 'bg-navy/10 text-navy',
    },
    {
      icon: Users,
      label: t('quickGCs'),
      description: t('quickGCsDesc'),
      href: '/general-contractors',
      color: 'bg-risk-low/10 text-risk-low',
    },
    {
      icon: Settings,
      label: t('quickSettings'),
      description: t('quickSettingsDesc'),
      href: '/settings',
      color: 'bg-warm-dark/10 text-warm-dark',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-xl border border-warm-gray bg-white p-4 shadow-sm transition-all hover:border-orange/30 hover:shadow-md"
          >
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${action.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-semibold text-navy group-hover:text-orange">
              {action.label}
            </h3>
            <p className="mt-0.5 text-xs text-warm-dark">{action.description}</p>
          </Link>
        )
      })}
    </div>
  )
}
