'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function ResetPasswordPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPw) {
      setError(t('passwordMismatch'))
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 2000)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-1 text-xl font-semibold text-navy">{t('resetPasswordTitle')}</h2>
        <p className="mb-6 text-sm text-warm-dark">{t('resetPasswordSubtitle')}</p>

        {success ? (
          <div className="rounded-lg bg-status-signed/10 p-4 text-center">
            <p className="text-sm text-navy">{t('passwordUpdated')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="password"
              label={t('newPassword')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Input
              id="confirm-password"
              label={t('confirmPassword')}
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <p className="text-sm text-risk-high">{error}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              {t('resetPasswordTitle')}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
