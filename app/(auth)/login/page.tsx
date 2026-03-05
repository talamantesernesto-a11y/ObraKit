'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

export default function LoginPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(t('invalidCredentials'))
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-1 text-xl font-semibold text-navy">{t('welcomeBack')}</h2>
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
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-risk-high">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {t('login')}
          </Button>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-orange hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-warm-dark">
          {t('noAccount')}{' '}
          <Link href="/signup" className="font-medium text-orange hover:underline">
            {t('signup')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
