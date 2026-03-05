'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Eraser } from 'lucide-react'

interface SignaturePadProps {
  onSignatureChange: (signatureDataUrl: string | null) => void
}

export function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const t = useTranslations('wizard')
  const sigRef = useRef<SignatureCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  // Resize canvas to match container width
  useEffect(() => {
    const resizeCanvas = () => {
      if (sigRef.current && containerRef.current) {
        const canvas = sigRef.current.getCanvas()
        const container = containerRef.current
        canvas.width = container.offsetWidth
        canvas.height = 160
        sigRef.current.clear()
        setIsEmpty(true)
        onSignatureChange(null)
      }
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [onSignatureChange])

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      setIsEmpty(false)
      onSignatureChange(sigRef.current.toDataURL('image/png'))
    }
  }

  const handleClear = () => {
    sigRef.current?.clear()
    setIsEmpty(true)
    onSignatureChange(null)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-navy">
        {t('signatureLabel')}
      </label>
      <div
        ref={containerRef}
        className="rounded-lg border-2 border-dashed border-warm-gray bg-white"
        style={{ touchAction: 'none' }}
      >
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            className: 'rounded-lg',
            style: { width: '100%', height: 160 },
          }}
          penColor="#1B2A4A"
          onEnd={handleEnd}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-warm-dark">{t('signatureHint')}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={isEmpty}
        >
          <Eraser className="h-3 w-3" />
          {t('clearSignature')}
        </Button>
      </div>
    </div>
  )
}
