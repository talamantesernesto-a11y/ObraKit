'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale()
  const router = useRouter()

  const toggleLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es'
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <button
      onClick={toggleLocale}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-warm-dark transition-colors hover:bg-warm-gray hover:text-navy',
        className
      )}
    >
      <Globe className="h-4 w-4" />
      {locale === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
