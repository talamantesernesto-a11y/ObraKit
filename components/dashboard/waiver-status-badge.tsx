import { Badge, type BadgeVariant } from '@/components/ui/badge'

const statusConfig: Record<string, { label_es: string; label_en: string; variant: BadgeVariant }> = {
  draft: { label_es: 'Borrador', label_en: 'Draft', variant: 'draft' },
  generated: { label_es: 'Generada', label_en: 'Generated', variant: 'generated' },
  sent: { label_es: 'Enviada', label_en: 'Sent', variant: 'sent' },
  signed: { label_es: 'Firmada', label_en: 'Signed', variant: 'signed' },
  countersigned: { label_es: 'Contrafirmada', label_en: 'Countersigned', variant: 'signed' },
}

interface WaiverStatusBadgeProps {
  status: string
  locale: string
}

export function WaiverStatusBadge({ status, locale }: WaiverStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft
  const label = locale === 'es' ? config.label_es : config.label_en
  return <Badge variant={config.variant}>{label}</Badge>
}
