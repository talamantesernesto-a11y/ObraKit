'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Send, CheckCircle, Loader2 } from 'lucide-react'

interface StepSignSendProps {
  projectId: string
  waiverType: string
  amount: number
  throughDate: string
  checkMaker: string
  checkAmount: number
  exceptions: string
  onGenerated: (waiverId: string, pdfUrl: string) => void
}

export function StepSignSend(props: StepSignSendProps) {
  const t = useTranslations('wizard')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/waivers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: props.projectId,
          waiver_type: props.waiverType,
          amount: props.amount,
          through_date: props.throughDate,
          check_maker: props.checkMaker,
          check_amount: props.checkAmount,
          exceptions: props.exceptions,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate')

      const data = await res.json()
      setPdfUrl(data.pdfUrl)
      setGenerated(true)
      props.onGenerated(data.waiverId, data.pdfUrl)
    } catch {
      setError(t('generateError'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-navy">{t('step4Title')}</h2>
        <p className="mt-1 text-sm text-warm-dark">{t('step4Subtitle')}</p>
      </div>

      {!generated ? (
        <Card>
          <CardContent className="flex flex-col items-center p-8">
            {generating ? (
              <div className="flex items-center gap-3 text-warm-dark">
                <Loader2 className="h-6 w-6 animate-spin text-orange" />
                <span className="text-lg">{t('generating')}</span>
              </div>
            ) : (
              <>
                <Button variant="accent" size="lg" onClick={handleGenerate}>
                  {t('step4Title')}
                </Button>
                {error && (
                  <p className="mt-4 text-sm text-risk-high">{error}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-risk-low" />
            <h3 className="mt-4 text-lg font-semibold text-navy">{t('generated')}</h3>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="accent">
                    <Download className="h-4 w-4" />
                    {t('step4Title')}
                  </Button>
                </a>
              )}
              <Button variant="outline" disabled>
                <Send className="h-4 w-4" />
                {t('sendComingSoon')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
