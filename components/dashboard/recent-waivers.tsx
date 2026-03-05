import Link from 'next/link'
import { WaiverStatusBadge } from './waiver-status-badge'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface RecentWaiver {
  id: string
  waiver_type: string
  amount: number
  status: string
  created_at: string
  project_id: string
  projects: { name: string } | null
}

interface RecentWaiversProps {
  waivers: RecentWaiver[]
  locale: string
}

export function RecentWaivers({ waivers, locale }: RecentWaiversProps) {
  if (waivers.length === 0) return null

  return (
    <div className="space-y-3">
      {waivers.map((waiver) => {
        const waiverType = WAIVER_TYPES[waiver.waiver_type as keyof typeof WAIVER_TYPES]
        const typeName = locale === 'es' ? waiverType?.name_es : waiverType?.name_en
        return (
          <Link
            key={waiver.id}
            href={`/projects/${waiver.project_id}`}
            className="flex items-center justify-between rounded-lg border border-warm-gray bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-navy">
                {waiver.projects?.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-warm-dark">
                {typeName} — {formatCurrency(waiver.amount)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-warm-dark">
                {formatDate(waiver.created_at, locale)}
              </span>
              <WaiverStatusBadge status={waiver.status} locale={locale} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
