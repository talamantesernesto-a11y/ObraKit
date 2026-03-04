'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { projectSchema, type ProjectFormData, SUPPORTED_STATES } from '@/lib/validations/project'
import { createProject } from '../actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import type { GeneralContractor } from '@/lib/supabase/types'

export default function NewProjectPage() {
  const t = useTranslations('projects')
  const tv = useTranslations('validation')
  const tc = useTranslations('common')
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [gcs, setGcs] = useState<GeneralContractor[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'active',
      retention_percentage: 10,
    },
  })

  useEffect(() => {
    async function loadGCs() {
      const supabase = createClient()
      const { data } = await supabase
        .from('general_contractors')
        .select('*')
        .order('name')
      if (data) setGcs(data as GeneralContractor[])
    }
    loadGCs()
  }, [])

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true)
    try {
      const result = await createProject(data as Record<string, unknown>)
      toast(t('new'), 'success')
      router.push(`/projects/${result.id}`)
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
              id="address"
              label={t('address')}
              error={errors.address ? tv('required') : undefined}
              required
              {...register('address')}
            />

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
                options={SUPPORTED_STATES}
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

            <Input
              id="owner_name"
              label={t('ownerName')}
              {...register('owner_name')}
            />

            <Select
              id="gc_id"
              label={t('gc')}
              options={gcs.map((gc) => ({ value: gc.id, label: gc.name }))}
              placeholder={t('selectGc')}
              {...register('gc_id')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="contract_value"
                label={t('contractValue')}
                type="number"
                step="0.01"
                min="0"
                {...register('contract_value')}
              />
              <Input
                id="retention_percentage"
                label={t('retentionPercentage')}
                type="number"
                step="0.5"
                min="0"
                max="100"
                {...register('retention_percentage')}
              />
            </div>

            <Input
              id="start_date"
              label={t('startDate')}
              type="date"
              {...register('start_date')}
            />

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
