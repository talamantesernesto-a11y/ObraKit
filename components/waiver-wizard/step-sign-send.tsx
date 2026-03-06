'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Send, CheckCircle, Loader2 } from 'lucide-react'
import { SignaturePad } from './signature-pad'
import { QrSignature } from './qr-signature'
import { useTouchDevice } from '@/hooks/use-touch-device'

interface StepSignSendProps {
  projectId: string
  waiverType: string
  amount: number
  throughDate: string
  checkMaker: string
  checkAmount: number
  exceptions: string
  gcEmail: string | null
  onGenerated: (waiverId: string, pdfUrl: string) => void
}

export function StepSignSend(props: StepSignSendProps) {
  const t = useTranslations('wizard')
  const isTouchDevice = useTouchDevice()
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [waiverId, setWaiverId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

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
          signature_image: signatureData,
        }),
      })

      if (!res.ok) throw new Error('Failed to generate')

      const data = await res.json()
      setPdfUrl(data.pdfUrl)
      setWaiverId(data.waiverId)
      props.onGenerated(data.waiverId, data.pdfUrl)
    } catch {
      setError(t('generateError'))
    } finally {
      setGenerating(false)
    }
  }

  const handleSend = async () => {
    if (!waiverId) return
    setSending(true)
    setSendError(null)

    try {
      const res = await fetch('/api/waivers/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waiver_id: waiverId }),
      })

      if (!res.ok) throw new Error('Failed to send')
      setSent(true)
    } catch {
      setSendError(t('sendError'))
    } finally {
      setSending(false)
    }
  }

  const isGenerated = !!pdfUrl

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-navy">{t('step4Title')}</h2>
        <p className="mt-1 text-sm text-warm-dark">{t('step4Subtitle')}</p>
      </div>

      {!isGenerated ? (
        <Card>
          <CardContent className="space-y-6 p-6">
            {generating ? (
              <div className="flex items-center justify-center gap-3 py-8 text-warm-dark">
                <Loader2 className="h-6 w-6 animate-spin text-orange" />
                <span className="text-lg">{t('generating')}</span>
              </div>
            ) : (
              <>
                <SignaturePad onSignatureChange={setSignatureData} />

                {!isTouchDevice && (
                  <QrSignature onSignatureChange={setSignatureData} />
                )}

                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={!signatureData}
                >
                  {t('generateAndSign')}
                </Button>

                {error && (
                  <p className="text-center text-sm text-risk-high">{error}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-6 p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-risk-low" />
            <h3 className="text-lg font-semibold text-navy">{t('generated')}</h3>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="accent">
                    <Download className="h-4 w-4" />
                    {t('step4Title')}
                  </Button>
                </a>
              )}

              {sent ? (
                <div className="rounded-lg bg-status-signed/10 px-4 py-2">
                  <p className="text-sm text-navy">
                    {t('sentTo', { email: props.gcEmail })}
                  </p>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleSend}
                  disabled={!props.gcEmail || sending}
                  loading={sending}
                >
                  <Send className="h-4 w-4" />
                  {props.gcEmail ? t('sendToGc') : t('noGcEmail')}
                </Button>
              )}
            </div>

            {sendError && (
              <p className="text-sm text-risk-high">{sendError}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
