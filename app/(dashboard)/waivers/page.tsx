import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { WaiverStatusBadge } from '@/components/dashboard/waiver-status-badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import { Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function WaiversPage() {
  const supabase = createClient()
  const t = await getTranslations('waivers')
  const locale = await getLocale()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!company) redirect('/settings')

  const { data: waivers } = await supabase
    .from('waivers')
    .select('*, projects(name, state)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">{t('title')}</h1>

      {waivers && waivers.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-warm-gray bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-warm-gray bg-warm-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{t('project')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{t('type')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{t('amount')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{t('throughDate')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{t('status')}</th>
                  <th className="px-4 py-3 text-left font-medium text-warm-dark">{t('created')}</th>
                  <th className="px-4 py-3 text-right font-medium text-warm-dark"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray">
                {waivers.map((waiver) => {
                  const project = waiver.projects as { name: string; state: string } | null
                  const wt = WAIVER_TYPES[waiver.waiver_type as keyof typeof WAIVER_TYPES]
                  const typeName = locale === 'es' ? wt?.name_es : wt?.name_en

                  return (
                    <tr key={waiver.id} className="hover:bg-warm-white/50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/projects/${waiver.project_id}`}
                          className="font-medium text-navy hover:text-orange"
                        >
                          {project?.name || '—'}
                        </Link>
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-warm-dark">
                        {typeName || waiver.waiver_type}
                      </td>
                      <td className="px-4 py-3 font-medium text-navy">
                        {formatCurrency(Number(waiver.amount))}
                      </td>
                      <td className="px-4 py-3 text-warm-dark">
                        {formatDate(waiver.through_date)}
                      </td>
                      <td className="px-4 py-3">
                        <WaiverStatusBadge status={waiver.status} locale={locale} />
                      </td>
                      <td className="px-4 py-3 text-warm-dark">
                        {formatDate(waiver.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {waiver.pdf_url && (
                          <a
                            href={waiver.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-orange hover:underline"
                          >
                            <Download className="h-3 w-3" />
                            PDF
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-warm-gray bg-white p-12 text-center">
          <p className="text-warm-dark">{t('empty')}</p>
          <p className="mt-1 text-sm text-warm-dark">{t('emptyAction')}</p>
        </div>
      )}
    </div>
  )
}
