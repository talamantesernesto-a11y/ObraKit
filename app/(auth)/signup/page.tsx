'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

export default function SignupPage() {
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'))
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl">📧</div>
          <h2 className="mb-2 text-xl font-semibold text-navy">{t('checkEmail')}</h2>
          <p className="text-sm text-warm-dark">{email}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-1 text-xl font-semibold text-navy">{t('createAccount')}</h2>
        <p className="mb-6 text-sm text-warm-dark">{t('subtitle')}</p>

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
          <Input
            id="password"
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <Input
            id="confirm-password"
            label={t('confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm text-risk-high">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {t('signup')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-warm-dark">
          {t('hasAccount')}{' '}
          <Link href="/login" className="font-medium text-orange hover:underline">
            {t('login')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
