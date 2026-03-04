'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { getRequiredFields } from '@/lib/waivers/state-rules'

interface StepDetailsProps {
  state: string
  data: {
    amount: string
    through_date: string
    check_maker: string
    check_amount: string
    exceptions: string
  }
  onChange: (field: string, value: string) => void
}

export function StepDetails({ state, data, onChange }: StepDetailsProps) {
  const t = useTranslations('wizard')
  const requiredFields = getRequiredFields(state)
  const needsCheckMaker = requiredFields.includes('check_maker')

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
    </div>
  )
}
