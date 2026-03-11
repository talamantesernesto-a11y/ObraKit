'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StickyMobileCta() {
  const t = useTranslations('landing')
  const [visible, setVisible] = useState(false)
  const wasVisible = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 600
      if (shouldShow !== wasVisible.current) {
        wasVisible.current = shouldShow
        setVisible(shouldShow)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-40 border-t border-warm-gray bg-white/95 p-3 backdrop-blur-md transition-transform duration-300 md:hidden',
      visible ? 'translate-y-0' : 'translate-y-full'
    )}>
      <Link href="/signup" className="block">
        <Button variant="accent" size="lg" className="w-full text-base">
          {t('heroCta')}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
      <p className="mt-1.5 text-center text-xs text-warm-dark">{t('heroBadge1')}</p>
    </div>
  )
}
