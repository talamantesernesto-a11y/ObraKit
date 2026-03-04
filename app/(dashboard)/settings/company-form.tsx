'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { companySchema, type CompanyFormData, US_STATES } from '@/lib/validations/company'
import { upsertCompany } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { useState } from 'react'
import type { Company } from '@/lib/supabase/types'

interface CompanyFormProps {
  company: Company | null
  isSetup: boolean
}

export function CompanyForm({ company, isSetup }: CompanyFormProps) {
  const t = useTranslations('company')
  const tv = useTranslations('validation')
  const tc = useTranslations('common')
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      address_line1: company?.address_line1 || '',
      address_line2: company?.address_line2 || '',
      city: company?.city || '',
      state: company?.state || '',
      zip: company?.zip || '',
      phone: company?.phone || '',
      email: company?.email || '',
      license_number: company?.license_number || '',
      ein: company?.ein || '',
      language_preference: company?.language_preference || 'es',
    },
  })

  const onSubmit = async (data: CompanyFormData) => {
    setLoading(true)
    try {
      await upsertCompany(data)
      toast(t('saved'), 'success')
      if (isSetup) {
        router.push('/')
        router.refresh()
      }
    } catch {
      toast('Error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={isSetup ? 'mx-auto max-w-2xl py-12' : ''}>
      <Card>
        <CardHeader>
          <CardTitle>{isSetup ? t('setup') : t('title')}</CardTitle>
          {isSetup && <CardDescription>{t('setupSubtitle')}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="name"
              label={t('name')}
              error={errors.name ? tv('required') : undefined}
              required
              {...register('name')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="address_line1"
                label={t('addressLine1')}
                error={errors.address_line1 ? tv('required') : undefined}
                required
                {...register('address_line1')}
              />
              <Input
                id="address_line2"
                label={t('addressLine2')}
                {...register('address_line2')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                id="city"
                label={t('city')}
                error={errors.city ? tv('required') : undefined}
                required
                {...register('city')}
              />
              <Select
                id="state"
                label={t('state')}
                options={US_STATES}
                placeholder="--"
                error={errors.state ? tv('required') : undefined}
                required
                {...register('state')}
              />
              <Input
                id="zip"
                label={t('zip')}
                error={errors.zip ? tv('required') : undefined}
                required
                {...register('zip')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="phone"
                label={t('phone')}
                type="tel"
                {...register('phone')}
              />
              <Input
                id="email"
                label={t('email')}
                type="email"
                {...register('email')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="license_number"
                label={t('licenseNumber')}
                {...register('license_number')}
              />
              <Input
                id="ein"
                label={t('ein')}
                {...register('ein')}
              />
            </div>

            <Select
              id="language_preference"
              label={t('language')}
              options={[
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' },
              ]}
              {...register('language_preference')}
            />

            <div className="flex justify-end gap-3">
              <Button type="submit" variant="accent" loading={loading}>
                {tc('save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
