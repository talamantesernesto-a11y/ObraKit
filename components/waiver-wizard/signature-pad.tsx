'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Eraser, Smartphone } from 'lucide-react'

const SIGNATURE_HEIGHT_MOBILE = 200
const SIGNATURE_HEIGHT_DESKTOP = 160

interface SignaturePadProps {
  onSignatureChange: (signatureDataUrl: string | null) => void
}

export function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const t = useTranslations('wizard')
  const sigRef = useRef<SignatureCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [isPortrait, setIsPortrait] = useState(true)

  // Resize canvas to match container width + detect orientation
  useEffect(() => {
    const getHeight = () =>
      window.innerWidth < 768 ? SIGNATURE_HEIGHT_MOBILE : SIGNATURE_HEIGHT_DESKTOP

    const resizeCanvas = () => {
      if (sigRef.current && containerRef.current) {
        const canvas = sigRef.current.getCanvas()
        const container = containerRef.current
        const height = getHeight()
        canvas.width = container.offsetWidth
        canvas.height = height
        sigRef.current.clear()
        setIsEmpty(true)
        onSignatureChange(null)
      }
      setIsPortrait(window.innerHeight > window.innerWidth)
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

  const height = typeof window !== 'undefined' && window.innerWidth < 768
    ? SIGNATURE_HEIGHT_MOBILE
    : SIGNATURE_HEIGHT_DESKTOP

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-navy">
        {t('signatureLabel')}
      </label>

      {/* Landscape hint on mobile portrait */}
      {isPortrait && (
        <div className="flex items-center gap-2 rounded-lg bg-orange/5 px-3 py-2 md:hidden">
          <Smartphone className="h-4 w-4 rotate-90 text-orange" />
          <p className="text-xs text-navy/70">{t('signatureLandscapeHint')}</p>
        </div>
      )}

      <div
        ref={containerRef}
        className="rounded-lg border-2 border-dashed border-warm-gray bg-white"
        style={{ touchAction: 'none' }}
      >
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            className: 'rounded-lg',
            style: { width: '100%', height },
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
          className="min-h-[44px] min-w-[44px]"
        >
          <Eraser className="h-3 w-3" />
          {t('clearSignature')}
        </Button>
      </div>
    </div>
  )
}
