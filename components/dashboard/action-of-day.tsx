import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, FileText, Send, ArrowRight, CheckCircle } from 'lucide-react'

interface ActionOfDayProps {
  pendingWaivers: number
  draftWaivers: number
  generatedWaivers: number
}

export async function ActionOfDay({
  pendingWaivers,
  draftWaivers,
  generatedWaivers,
}: ActionOfDayProps) {
  const t = await getTranslations('dashboard')

  // Determine the primary action
  if (pendingWaivers === 0 && draftWaivers === 0 && generatedWaivers === 0) {
    return (
      <div className="rounded-2xl border border-risk-low/20 bg-risk-low/5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-risk-low/20">
            <CheckCircle className="h-6 w-6 text-risk-low" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-navy">
              {t('actionAllClear')}
            </h2>
            <p className="text-sm text-warm-dark">{t('actionAllClearDesc')}</p>
          </div>
        </div>
      </div>
    )
  }

  const actions = []

  if (draftWaivers > 0) {
    actions.push({
      icon: FileText,
      color: 'orange' as const,
      title: t('actionDrafts', { count: draftWaivers }),
      description: t('actionDraftsDesc'),
      href: '/waivers',
      ctaLabel: t('actionDraftsCta'),
    })
  }

  if (generatedWaivers > 0) {
    actions.push({
      icon: Send,
      color: 'blue' as const,
      title: t('actionGenerated', { count: generatedWaivers }),
      description: t('actionGeneratedDesc'),
      href: '/waivers',
      ctaLabel: t('actionGeneratedCta'),
    })
  }

  const colorMap = {
    orange: {
      bg: 'bg-orange/10',
      icon: 'text-orange',
      border: 'border-orange/20',
      surface: 'bg-orange/5',
    },
    blue: {
      bg: 'bg-navy/10',
      icon: 'text-navy',
      border: 'border-navy/20',
      surface: 'bg-navy/5',
    },
  }

  return (
    <div className="space-y-3">
      {/* Urgency banner when there are pending items */}
      <div className="flex items-center gap-3 rounded-xl border border-orange/20 bg-orange/5 px-5 py-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-orange" />
        <p className="text-sm font-medium text-navy">
          {t('actionUrgent', { count: pendingWaivers })}
        </p>
      </div>

      {/* Action cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          const colors = colorMap[action.color]
          return (
            <div
              key={action.title}
              className={`rounded-2xl border ${colors.border} ${colors.surface} p-5`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-navy">{action.title}</h3>
                  <p className="mt-1 text-sm text-warm-dark">{action.description}</p>
                  <Link href={action.href} className="mt-3 inline-block">
                    <Button variant="accent" size="sm">
                      {action.ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
