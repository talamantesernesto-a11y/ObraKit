'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StepTypeSelect } from './step-type-select'
import { StepDetails } from './step-details'
import { StepReview } from './step-review'
import { StepSignSend } from './step-sign-send'
import type { WaiverTypeId } from '@/lib/waivers/types'
import type { Project, Company } from '@/lib/supabase/types'
import { getStateRule } from '@/lib/waivers/state-rules'

interface WizardContainerProps {
  project: Project
  company: Company
  totalPreviouslyBilled: number
}

const TOTAL_STEPS = 4

export function WizardContainer({ project, company, totalPreviouslyBilled }: WizardContainerProps) {
  const t = useTranslations('wizard')
  const tc = useTranslations('common')
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [waiverType, setWaiverType] = useState<WaiverTypeId | null>(null)
  const [details, setDetails] = useState({
    amount: '',
    through_date: new Date().toISOString().split('T')[0],
    check_maker: '',
    check_amount: '',
    exceptions: '',
    is_public_project: false,
    county: '',
  })

  const stateRule = getStateRule(project.state)

  const canProceed = () => {
    if (step === 1) return waiverType !== null
    if (step === 2) {
      if (details.amount === '' || details.through_date === '') return false
      // Block advance waivers in states that prohibit them
      if (stateRule?.prohibitsAdvanceWaivers) {
        const throughDate = new Date(details.through_date + 'T00:00:00')
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (throughDate > today) return false
      }
      return true
    }
    return true
  }

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleDetailChange = (field: string, value: string | boolean) => {
    setDetails((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-navy">
            {t('stepOf', { current: step, total: TOTAL_STEPS })}
          </p>
          <p className="text-sm text-warm-dark">{t(`stepTitle${step}`)}</p>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                i + 1 <= step ? 'bg-orange' : 'bg-warm-gray'
              )}
            />
          ))}
        </div>
      </div>

      {/* Steps */}
      {step === 1 && (
        <StepTypeSelect
          state={project.state}
          selected={waiverType}
          onSelect={setWaiverType}
        />
      )}

      {step === 2 && (
        <StepDetails
          state={project.state}
          waiverType={waiverType || 'conditional_progress'}
          data={details}
          onChange={handleDetailChange}
        />
      )}

      {step === 3 && waiverType && (
        <StepReview
          waiverType={waiverType}
          state={project.state}
          amount={Number(details.amount)}
          throughDate={details.through_date}
          checkMaker={details.check_maker}
          exceptions={details.exceptions}
          projectContractValue={Number(project.contract_value) || 0}
          totalPreviouslyBilled={totalPreviouslyBilled}
          retentionPercentage={Number(project.retention_percentage) || 0}
          isPublicProject={details.is_public_project}
          county={details.county}
        />
      )}

      {step === 4 && waiverType && (
        <StepSignSend
          projectId={project.id}
          waiverType={waiverType}
          amount={Number(details.amount)}
          throughDate={details.through_date}
          checkMaker={details.check_maker}
          checkAmount={Number(details.check_amount) || 0}
          exceptions={details.exceptions}
          gcEmail={(project.general_contractors as { contact_email: string | null } | null)?.contact_email || null}
          isPublicProject={details.is_public_project}
          county={details.county}
          onGenerated={() => {
            router.refresh()
          }}
        />
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className="min-h-[48px] flex-1 sm:flex-none"
            onClick={step === 1 ? () => router.back() : goBack}
          >
            {step === 1 ? tc('cancel') : tc('back')}
          </Button>
          <Button
            variant="accent"
            size="lg"
            className="min-h-[48px] flex-1 sm:flex-none"
            onClick={goNext}
            disabled={!canProceed()}
          >
            {tc('next')}
          </Button>
        </div>
      )}
    </div>
  )
}
