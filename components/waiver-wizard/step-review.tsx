'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { WAIVER_TYPES, type WaiverTypeId } from '@/lib/waivers/types'
import type { ValidationResult } from '@/lib/ai/validate-waiver'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StepReviewProps {
  waiverType: WaiverTypeId
  state: string
  amount: number
  throughDate: string
  checkMaker: string
  exceptions: string
  projectContractValue: number
  totalPreviouslyBilled: number
  retentionPercentage: number
}

export function StepReview(props: StepReviewProps) {
  const t = useTranslations('wizard')
  const locale = useLocale()
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch('/api/waivers/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            waiverType: props.waiverType,
            state: props.state,
            amount: props.amount,
            throughDate: props.throughDate,
            projectContractValue: props.projectContractValue,
            totalPreviouslyBilled: props.totalPreviouslyBilled,
            isFinalPayment: props.waiverType.includes('final'),
            hasRetention: props.retentionPercentage > 0,
            retentionPercentage: props.retentionPercentage,
          }),
        })
        const data = await res.json()
        setValidation(data)
      } catch {
        setValidation({
          isValid: true,
          errors: [],
          warnings: [{
            field: 'general',
            message_en: 'AI validation unavailable',
            message_es: 'Validación AI no disponible',
          }],
        })
      } finally {
        setLoading(false)
      }
    }
    validate()
  }, [props])

  const wt = WAIVER_TYPES[props.waiverType]
  const waiverName = locale === 'es' ? wt.name_es : wt.name_en

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-navy">{t('step3Title')}</h2>
        <p className="mt-1 text-sm text-warm-dark">{t('step3Subtitle')}</p>
      </div>

      {/* Validation Status */}
      <Card>
        <CardContent className="p-5">
          {loading ? (
            <div className="flex items-center gap-3 text-warm-dark">
              <Loader2 className="h-5 w-5 animate-spin text-orange" />
              <span>{t('validating')}</span>
            </div>
          ) : validation ? (
            <div className="space-y-4">
              {validation.errors.length === 0 && validation.warnings.length === 0 && (
                <div className="flex items-center gap-3 text-risk-low">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{t('validationPassed')}</span>
                </div>
              )}
              {validation.errors.map((err, i) => (
                <div key={`err-${i}`} className="flex items-start gap-3 text-risk-high">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-sm">{locale === 'es' ? err.message_es : err.message_en}</span>
                </div>
              ))}
              {validation.warnings.map((warn, i) => (
                <div key={`warn-${i}`} className="flex items-start gap-3 text-risk-medium">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-sm">{locale === 'es' ? warn.message_es : warn.message_en}</span>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold text-navy">{t('summary')}</h3>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-warm-dark">{t('step1Title')}</dt>
              <dd className="text-sm font-medium text-navy">{waiverName}</dd>
            </div>
            <div>
              <dt className="text-xs text-warm-dark">{t('amount')}</dt>
              <dd className="text-sm font-medium text-navy">{formatCurrency(props.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs text-warm-dark">{t('throughDate')}</dt>
              <dd className="text-sm font-medium text-navy">{props.throughDate}</dd>
            </div>
            {props.checkMaker && (
              <div>
                <dt className="text-xs text-warm-dark">{t('checkMaker')}</dt>
                <dd className="text-sm font-medium text-navy">{props.checkMaker}</dd>
              </div>
            )}
            {props.exceptions && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-warm-dark">{t('exceptions')}</dt>
                <dd className="text-sm font-medium text-navy">{props.exceptions}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
