import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { FolderKanban, FileText, Clock, DollarSign, Send, PenTool } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StatsOverviewProps {
  activeProjects: number
  waiversThisMonth: number
  pendingWaivers: number
  totalBilled: number
  waiversSent: number
  waiversSigned: number
}

export function StatsOverview({
  activeProjects,
  waiversThisMonth,
  pendingWaivers,
  totalBilled,
  waiversSent,
  waiversSigned,
}: StatsOverviewProps) {
  const t = useTranslations('dashboard')

  const stats = [
    { label: t('activeProjects'), value: activeProjects.toString(), icon: FolderKanban, color: 'text-status-generated' },
    { label: t('waiversThisMonth'), value: waiversThisMonth.toString(), icon: FileText, color: 'text-orange' },
    { label: t('pendingWaivers'), value: pendingWaivers.toString(), icon: Clock, color: 'text-status-sent' },
    { label: t('totalBilled'), value: formatCurrency(totalBilled), icon: DollarSign, color: 'text-risk-low' },
    { label: t('waiversSent'), value: waiversSent.toString(), icon: Send, color: 'text-status-sent' },
    { label: t('waiversSigned'), value: waiversSigned.toString(), icon: PenTool, color: 'text-status-signed' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-warm-gray/50 p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-warm-dark">{stat.label}</p>
                <p className="text-2xl font-bold text-navy">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
