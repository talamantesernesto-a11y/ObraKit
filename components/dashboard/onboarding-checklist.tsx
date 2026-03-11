import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { CheckCircle2, Circle, ArrowRight, Building2, FolderPlus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingChecklistProps {
  hasCompany: boolean
  hasProject: boolean
  hasWaiver: boolean
}

export async function OnboardingChecklist({
  hasCompany,
  hasProject,
  hasWaiver,
}: OnboardingChecklistProps) {
  const t = await getTranslations('dashboard')

  // Don't show if all steps complete
  if (hasCompany && hasProject && hasWaiver) return null

  const steps = [
    {
      done: hasCompany,
      icon: Building2,
      label: t('onboardingStep1'),
      description: t('onboardingStep1Desc'),
      href: '/settings',
    },
    {
      done: hasProject,
      icon: FolderPlus,
      label: t('onboardingStep2'),
      description: t('onboardingStep2Desc'),
      href: '/projects/new',
    },
    {
      done: hasWaiver,
      icon: FileText,
      label: t('onboardingStep3'),
      description: t('onboardingStep3Desc'),
      href: '/waivers',
    },
  ]

  // Find first incomplete step
  const nextStep = steps.find((s) => !s.done)
  const completedCount = steps.filter((s) => s.done).length

  return (
    <div className="rounded-2xl border border-orange/20 bg-gradient-to-r from-orange/5 to-navy/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy">
            {t('onboardingTitle')}
          </h2>
          <p className="mt-0.5 text-sm text-warm-dark">
            {t('onboardingSubtitle', { completed: completedCount, total: 3 })}
          </p>
        </div>
        {/* Progress */}
        <div className="flex items-center gap-1.5">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full ${
                step.done ? 'bg-risk-low' : 'bg-warm-gray'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon
          const isNext = step === nextStep
          return (
            <div
              key={step.label}
              className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
                step.done
                  ? 'bg-risk-low/5'
                  : isNext
                  ? 'bg-white shadow-sm'
                  : 'opacity-50'
              }`}
            >
              <div className="flex-shrink-0">
                {step.done ? (
                  <CheckCircle2 className="h-6 w-6 text-risk-low" />
                ) : (
                  <Circle className={`h-6 w-6 ${isNext ? 'text-orange' : 'text-warm-gray'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${step.done ? 'text-warm-dark line-through' : 'text-navy'}`}>
                  {step.label}
                </p>
                {!step.done && (
                  <p className="text-xs text-warm-dark">{step.description}</p>
                )}
              </div>
              {isNext && (
                <Link href={step.href}>
                  <Button variant="accent" size="sm">
                    {t('onboardingCta')}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
