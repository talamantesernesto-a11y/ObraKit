'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SignaturePad } from '@/components/waiver-wizard/signature-pad'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

const texts = {
  es: {
    title: 'Firma tu waiver',
    subtitle: 'Dibuja tu firma abajo y presiona Firmar',
    sign: 'Firmar',
    success: 'Firma enviada. Puedes cerrar esta página.',
    expired: 'Este enlace ha expirado. Genera uno nuevo en la app.',
  },
  en: {
    title: 'Sign your waiver',
    subtitle: 'Draw your signature below and tap Sign',
    sign: 'Sign',
    success: 'Signature sent. You can close this page.',
    expired: 'This link has expired. Generate a new one in the app.',
  },
}

function getLocale(): 'es' | 'en' {
  if (typeof document === 'undefined') return 'es'
  const match = document.cookie.match(/(?:^|;\s*)locale=(\w+)/)
  return match?.[1] === 'en' ? 'en' : 'es'
}

export default function PhoneSignPage() {
  const params = useParams<{ token: string }>()
  const channelId = params.token
  const [locale, setLocale] = useState<'es' | 'en'>('es')
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLocale(getLocale())
  }, [])

  const t = texts[locale]

  const handleSignatureChange = useCallback((data: string | null) => {
    setSignatureData(data)
  }, [])

  const handleSubmit = async () => {
    if (!signatureData || !channelId) return
    setSending(true)

    try {
      const supabase = createClient()
      const channel = supabase.channel(`sign:${channelId}`)

      await channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'signature-submitted',
            payload: { signatureDataUrl: signatureData },
          }).then(() => {
            setSent(true)
            setSending(false)
            // Clean up after a short delay
            setTimeout(() => supabase.removeChannel(channel), 1000)
          })
        }
      })
    } catch {
      setError(true)
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle className="h-16 w-16 text-risk-low" />
        <p className="text-lg font-medium text-navy">{t.success}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-risk-high">{t.expired}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-navy">{t.title}</h1>
        <p className="mt-1 text-sm text-warm-dark">{t.subtitle}</p>
      </div>

      <SignaturePad onSignatureChange={handleSignatureChange} />

      <Button
        variant="accent"
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={!signatureData || sending}
        loading={sending}
      >
        {t.sign}
      </Button>
    </div>
  )
}
