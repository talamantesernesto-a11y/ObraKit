import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Pencil } from 'lucide-react'
import type { WaiverStatus } from '@/lib/supabase/types'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const t = await getTranslations('projects')
  const tw = await getTranslations('waivers')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*, general_contractors(*)')
    .eq('id', params.id)
    .single()

  if (!project) notFound()

  // Get waivers for this project
  const { data: waivers } = await supabase
    .from('waivers')
    .select('*')
    .eq('project_id', params.id)
    .order('created_at', { ascending: false })

  const totalBilled = waivers?.reduce((sum, w) => sum + Number(w.amount), 0) || 0
  const contractValue = Number(project.contract_value) || 0
  const remaining = contractValue - totalBilled

  const statusVariant = (s: string) => {
    const map: Record<string, 'draft' | 'generated' | 'sent' | 'signed'> = {
      draft: 'draft', generated: 'generated', sent: 'sent', signed: 'signed', countersigned: 'signed',
    }
    return map[s] || 'draft'
  }

  const gc = project.general_contractors as { name: string; contact_name: string; contact_email: string; contact_phone: string } | null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{project.name}</h1>
          <p className="text-sm text-warm-dark">{project.address}, {project.city}, {project.state} {project.zip}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${params.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4" />
              {t('edit')}
            </Button>
          </Link>
          <Link href={`/projects/${params.id}/waivers/new`}>
            <Button variant="accent">
              <Plus className="h-4 w-4" />
              {t('createWaiver')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contract Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('contractSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-warm-dark">{t('contractValue')}</span>
              <span className="font-medium">{formatCurrency(contractValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-warm-dark">{t('totalBilled')}</span>
              <span className="font-medium">{formatCurrency(totalBilled)}</span>
            </div>
            <div className="flex justify-between border-t border-warm-gray pt-3">
              <span className="text-sm font-medium text-warm-dark">{t('remaining')}</span>
              <span className="font-bold text-navy">{formatCurrency(remaining)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-warm-dark">{t('retentionPercentage')}</span>
              <span className="font-medium">{project.retention_percentage}%</span>
            </div>
          </CardContent>
        </Card>

        {/* GC Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('gc')}</CardTitle>
          </CardHeader>
          <CardContent>
            {gc ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-navy">{gc.name}</p>
                {gc.contact_name && <p className="text-warm-dark">{gc.contact_name}</p>}
                {gc.contact_email && <p className="text-warm-dark">{gc.contact_email}</p>}
                {gc.contact_phone && <p className="text-warm-dark">{gc.contact_phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-warm-dark">{t('noGc')}</p>
            )}
          </CardContent>
        </Card>

        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('status')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant={project.status === 'active' ? 'signed' : 'draft'}>
              {project.status === 'active' ? t('statusActive') : project.status === 'completed' ? t('statusCompleted') : t('statusOnHold')}
            </Badge>
            {project.owner_name && (
              <div>
                <p className="text-xs text-warm-dark">{t('ownerName')}</p>
                <p className="text-sm font-medium">{project.owner_name}</p>
              </div>
            )}
            {project.start_date && (
              <div>
                <p className="text-xs text-warm-dark">{t('startDate')}</p>
                <p className="text-sm font-medium">{formatDate(project.start_date)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Waivers */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-navy">{t('waivers')}</h2>
        {waivers && waivers.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-warm-gray bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-warm-gray bg-warm-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{tw('type')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{tw('amount')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{tw('throughDate')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{tw('status')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{tw('created')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray">
                {waivers.map((waiver) => (
                  <tr key={waiver.id} className="hover:bg-warm-white/50">
                    <td className="px-4 py-3 font-medium text-navy">{waiver.waiver_type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">{formatCurrency(Number(waiver.amount))}</td>
                    <td className="px-4 py-3">{formatDate(waiver.through_date)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(waiver.status)}>{waiver.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-warm-dark">{formatDate(waiver.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-warm-gray bg-white p-8 text-center">
            <p className="text-warm-dark">{t('noWaivers')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
