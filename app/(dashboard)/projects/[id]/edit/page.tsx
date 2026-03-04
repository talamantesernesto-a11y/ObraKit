'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { projectSchema, type ProjectFormData, SUPPORTED_STATES } from '@/lib/validations/project'
import { updateProject } from '../../actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import type { GeneralContractor } from '@/lib/supabase/types'

export default function EditProjectPage() {
  const t = useTranslations('projects')
  const tv = useTranslations('validation')
  const tc = useTranslations('common')
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [gcs, setGcs] = useState<GeneralContractor[]>([])
  const [ready, setReady] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const [projectRes, gcsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('id', projectId).single(),
        supabase.from('general_contractors').select('*').order('name'),
      ])

      if (gcsRes.data) setGcs(gcsRes.data as GeneralContractor[])

      if (projectRes.data) {
        const p = projectRes.data
        reset({
          name: p.name,
          address: p.address,
          city: p.city || '',
          state: p.state,
          zip: p.zip || '',
          owner_name: p.owner_name || '',
          gc_id: p.gc_id || '',
          contract_value: p.contract_value ? Number(p.contract_value) : undefined,
          retention_percentage: p.retention_percentage ? Number(p.retention_percentage) : 10,
          start_date: p.start_date || '',
          status: p.status || 'active',
        })
      }

      setReady(true)
    }
    loadData()
  }, [projectId, reset])

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true)
    try {
      await updateProject(projectId, data as Record<string, unknown>)
      toast(t('updated'), 'success')
      router.push(`/projects/${projectId}`)
    } catch {
      toast('Error', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-warm-dark">{tc('loading')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('edit')}</CardTitle>
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

            <Select
              id="status"
              label={t('status')}
              options={[
                { value: 'active', label: t('statusActive') },
                { value: 'completed', label: t('statusCompleted') },
                { value: 'on_hold', label: t('statusOnHold') },
              ]}
              {...register('status')}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {tc('cancel')}
              </Button>
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
