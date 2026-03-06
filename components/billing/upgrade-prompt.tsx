'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import { useState } from 'react'

interface UpgradePromptProps {
  current: number
  limit: number
  type?: 'waiver' | 'project'
}

export function UpgradePrompt({ current, limit, type = 'waiver' }: UpgradePromptProps) {
  const t = useTranslations('billing')
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(false)
    }
  }

  const title = type === 'waiver' ? t('limitReached') : t('projectLimitReached')
  const description = type === 'waiver'
    ? t('limitReachedDescription', { current, limit })
    : t('projectLimitDescription')

  return (
    <div className="mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-warm-dark">{description}</p>
          <Button variant="accent" className="w-full" onClick={handleUpgrade} loading={loading}>
            <Zap className="h-4 w-4" />
            {t('upgradeToPro')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
