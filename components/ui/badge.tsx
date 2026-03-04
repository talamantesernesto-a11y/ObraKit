import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'draft' | 'generated' | 'sent' | 'signed' | 'low' | 'medium' | 'high'

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-warm-gray text-navy',
  draft: 'bg-status-draft/10 text-status-draft border-status-draft/30',
  generated: 'bg-status-generated/10 text-status-generated border-status-generated/30',
  sent: 'bg-status-sent/10 text-status-sent border-status-sent/30',
  signed: 'bg-status-signed/10 text-status-signed border-status-signed/30',
  low: 'bg-risk-low/10 text-risk-low border-risk-low/30',
  medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium/30',
  high: 'bg-risk-high/10 text-risk-high border-risk-high/30',
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge, type BadgeVariant }
