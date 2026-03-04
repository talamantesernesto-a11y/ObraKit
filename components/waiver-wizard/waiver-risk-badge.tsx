import { Badge } from '@/components/ui/badge'
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react'

const icons = {
  low: ShieldCheck,
  medium: AlertTriangle,
  high: AlertOctagon,
}

interface WaiverRiskBadgeProps {
  level: 'low' | 'medium' | 'high'
  label: string
}

export function WaiverRiskBadge({ level, label }: WaiverRiskBadgeProps) {
  const Icon = icons[level]

  return (
    <Badge variant={level} className="gap-1.5 px-3 py-1">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  )
}
