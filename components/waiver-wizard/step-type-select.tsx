'use client'

import { useLocale, useTranslations } from 'next-intl'
import { WAIVER_TYPES, type WaiverTypeId } from '@/lib/waivers/types'
import { getAvailableWaiverTypes } from '@/lib/waivers/state-rules'
import { WaiverRiskBadge } from './waiver-risk-badge'
import { cn } from '@/lib/utils'

interface StepTypeSelectProps {
  state: string
  selected: WaiverTypeId | null
  onSelect: (type: WaiverTypeId) => void
}

export function StepTypeSelect({ state, selected, onSelect }: StepTypeSelectProps) {
  const locale = useLocale()
  const t = useTranslations('wizard')
  const availableTypes = getAvailableWaiverTypes(state)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-navy">{t('step1Title')}</h2>
        <p className="mt-1 text-sm text-warm-dark">{t('step1Subtitle')}</p>
      </div>

      <div className="grid gap-4">
        {availableTypes.map((typeId) => {
          const wt = WAIVER_TYPES[typeId]
          const isSelected = selected === typeId
          const name = locale === 'es' ? wt.name_es : wt.name_en
          const description = locale === 'es' ? wt.description_es : wt.description_en
          const riskLabel = locale === 'es' ? wt.risk_label_es : wt.risk_label_en

          return (
            <button
              key={typeId}
              type="button"
              onClick={() => onSelect(typeId)}
              className={cn(
                'w-full rounded-xl border-2 p-5 text-left transition-all',
                isSelected
                  ? 'border-orange bg-orange/5 shadow-md'
                  : 'border-warm-gray bg-white hover:border-orange/50 hover:shadow-sm'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-navy">{name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-dark">{description}</p>
                </div>
                <div className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                  isSelected ? 'border-orange bg-orange' : 'border-warm-gray'
                )}>
                  {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </div>
              <div className="mt-3">
                <WaiverRiskBadge level={wt.risk_level} label={riskLabel} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
