'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { contractorSchema, type ContractorFormData } from '@/lib/validations/contractor'
import { createContractor } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'

export default function NewContractorPage() {
  const t = useTranslations('contractors')
  const tv = useTranslations('validation')
  const tc = useTranslations('common')
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
  })

  const onSubmit = async (data: ContractorFormData) => {
    setLoading(true)
    try {
      await createContractor(data as Record<string, unknown>)
      toast(t('new'), 'success')
      router.push('/general-contractors')
    } catch {
      toast('Error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('new')}</CardTitle>
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

            <Input
              id="contact_name"
              label={t('contactName')}
              {...register('contact_name')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="contact_email"
                label={t('contactEmail')}
                type="email"
                {...register('contact_email')}
              />
              <Input
                id="contact_phone"
                label={t('contactPhone')}
                type="tel"
                {...register('contact_phone')}
              />
            </div>

            <Input
              id="address"
              label={t('address')}
              {...register('address')}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input id="city" label={t('city')} {...register('city')} />
              <Input id="state" label={t('state')} {...register('state')} />
              <Input id="zip" label={t('zip')} {...register('zip')} />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-navy">{t('notes')}</label>
              <textarea
                id="notes"
                className="input-base mt-1 min-h-[80px]"
                {...register('notes')}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {tc('cancel')}
              </Button>
              <Button type="submit" variant="accent" loading={loading}>
                {tc('create')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
