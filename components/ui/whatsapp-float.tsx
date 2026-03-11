'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const WHATSAPP_NUMBER = '13393312827'

export function WhatsAppFloat() {
  const t = useTranslations('common')
  const [tooltip, setTooltip] = useState(true)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      {tooltip && (
        <div className="relative flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 shadow-lg">
          <p className="text-sm font-medium text-white">{t('whatsappTooltip')}</p>
          <button
            onClick={() => setTooltip(false)}
            className="ml-1 flex-shrink-0 text-white/50 hover:text-white"
            aria-label={t('close')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-navy" />
        </div>
      )}

      {/* WhatsApp button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsappDefaultMessage'))}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsappSupport')}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2'
        )}
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  )
}
