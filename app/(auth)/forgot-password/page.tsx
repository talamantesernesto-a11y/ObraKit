'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-1 text-xl font-semibold text-navy">{t('forgotPasswordTitle')}</h2>
        <p className="mb-6 text-sm text-warm-dark">{t('forgotPasswordSubtitle')}</p>

        {sent ? (
          <div className="rounded-lg bg-status-signed/10 p-4 text-center">
            <p className="text-sm text-navy">{t('resetLinkSent')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Button type="submit" className="w-full" loading={loading}>
              {t('sendResetLink')}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/login" className="text-sm font-medium text-orange hover:underline">
          {t('backToLogin')}
        </Link>
      </CardFooter>
    </Card>
  )
}
