'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { QRCodeSVG } from 'qrcode.react'
import { Smartphone, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSignatureChannel } from '@/hooks/use-signature-channel'

interface QrSignatureProps {
  onSignatureChange: (signatureDataUrl: string | null) => void
}

export function QrSignature({ onSignatureChange }: QrSignatureProps) {
  const t = useTranslations('wizard')
  const [showQr, setShowQr] = useState(false)
  const { channelId, signatureData, isConnected } = useSignatureChannel()

  const signUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/sign/${channelId}`
    : ''

  useEffect(() => {
    if (signatureData) {
      onSignatureChange(signatureData)
    }
  }, [signatureData, onSignatureChange])

  if (signatureData) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-risk-low">
          <CheckCircle className="h-4 w-4" />
          {t('signatureReceived')}
        </div>
        <div className="rounded-lg border-2 border-risk-low/30 bg-white p-2">
          <img
            src={signatureData}
            alt="Signature"
            className="mx-auto h-[160px] object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-warm-gray" />
        <span className="mx-4 flex-shrink-0 text-sm text-warm-dark">
          {t('orSignWithPhone')}
        </span>
        <div className="flex-grow border-t border-warm-gray" />
      </div>

      {!showQr ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowQr(true)}
        >
          <Smartphone className="h-4 w-4" />
          {t('signWithPhone')}
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-warm-gray bg-warm-white p-6">
          <p className="text-center text-sm text-warm-dark">
            {t('scanQrCode')}
          </p>
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={signUrl} size={180} level="M" />
          </div>
          <div className="flex items-center gap-2 text-xs text-warm-dark">
            {isConnected ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-orange" />
                {t('waitingForSignature')}
              </>
            ) : (
              <>
                <div className="h-2 w-2 animate-pulse rounded-full bg-warm-gray" />
                Connecting...
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
