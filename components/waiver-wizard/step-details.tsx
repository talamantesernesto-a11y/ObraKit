'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { getRequiredFields, getStateRule } from '@/lib/waivers/state-rules'
import { AlertTriangle, Info } from 'lucide-react'

interface StepDetailsProps {
  state: string
  waiverType: string
  data: {
    amount: string
    through_date: string
    check_maker: string
    check_amount: string
    exceptions: string
    is_public_project: boolean
    county: string
  }
  onChange: (field: string, value: string | boolean) => void
}

export function StepDetails({ state, waiverType, data, onChange }: StepDetailsProps) {
  const t = useTranslations('wizard')
  const locale = useLocale()
  const requiredFields = getRequiredFields(state)
  const needsCheckMaker = requiredFields.includes('check_maker')
  const stateRule = getStateRule(state)

  // Advance waiver detection: check if through_date is in the future
  const advanceWaiverWarning = useMemo(() => {
    if (!data.through_date) return null
    const throughDate = new Date(data.through_date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (throughDate <= today) return null

    const isBlocking = stateRule?.prohibitsAdvanceWaivers ?? false
    return { isBlocking }
  }, [data.through_date, stateRule])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-navy">{t('step2Title')}</h2>
        <p className="mt-1 text-sm text-warm-dark">{t('step2Subtitle')}</p>
      </div>

      <Input
        id="amount"
        label={t('amount')}
        type="number"
        step="0.01"
        min="0"
        required
        value={data.amount}
        onChange={(e) => onChange('amount', e.target.value)}
      />

      <Input
        id="through_date"
        label={t('throughDate')}
        type="date"
        required
        hint={t('throughDateHelp')}
        value={data.through_date}
        onChange={(e) => onChange('through_date', e.target.value)}
      />

      {/* Advance waiver warning */}
      {advanceWaiverWarning && (
        <div className={`flex items-start gap-3 rounded-lg p-4 ${advanceWaiverWarning.isBlocking ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
          <AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${advanceWaiverWarning.isBlocking ? 'text-red-600' : 'text-amber-600'}`} />
          <div>
            <p className={`text-sm font-medium ${advanceWaiverWarning.isBlocking ? 'text-red-800' : 'text-amber-800'}`}>
              {locale === 'es' ? t('advanceWaiverTitle') : t('advanceWaiverTitle')}
            </p>
            <p className={`mt-1 text-sm ${advanceWaiverWarning.isBlocking ? 'text-red-700' : 'text-amber-700'}`}>
              {advanceWaiverWarning.isBlocking
                ? t('advanceWaiverBlocked', { state: stateRule?.stateName || state })
                : t('advanceWaiverWarn', { state: stateRule?.stateName || state })}
            </p>
          </div>
        </div>
      )}

      <Input
        id="county"
        label={t('county')}
        hint={t('countyHelp')}
        value={data.county}
        onChange={(e) => onChange('county', e.target.value)}
      />

      {needsCheckMaker && (
        <>
          <Input
            id="check_maker"
            label={t('checkMaker')}
            hint={t('checkMakerHelp')}
            value={data.check_maker}
            onChange={(e) => onChange('check_maker', e.target.value)}
          />
          <Input
            id="check_amount"
            label={t('checkAmount')}
            type="number"
            step="0.01"
            min="0"
            value={data.check_amount}
            onChange={(e) => onChange('check_amount', e.target.value)}
          />
        </>
      )}

      <div>
        <label htmlFor="exceptions" className="block text-sm font-medium text-navy">
          {t('exceptions')}
        </label>
        <textarea
          id="exceptions"
          className="input-base mt-1 min-h-[80px]"
          placeholder={t('exceptionsHelp')}
          value={data.exceptions}
          onChange={(e) => onChange('exceptions', e.target.value)}
        />
      </div>

      {/* Public project checkbox */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.is_public_project}
            onChange={(e) => onChange('is_public_project', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-warm-gray text-orange focus:ring-orange"
          />
          <span className="text-sm text-navy">{t('isPublicProject')}</span>
        </label>

        {data.is_public_project && (
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">{t('publicProjectTitle')}</p>
              <p className="mt-1 text-sm text-blue-700">{t('publicProjectWarn')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
