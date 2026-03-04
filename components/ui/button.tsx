import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'default' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'default' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-navy text-white hover:bg-navy-light',
  secondary: 'bg-warm-gray text-navy hover:bg-warm-gray/80',
  accent: 'bg-orange text-white hover:bg-orange-dark',
  outline: 'border border-warm-gray bg-transparent text-navy hover:bg-warm-gray/50',
  ghost: 'bg-transparent text-navy hover:bg-warm-gray/50',
  destructive: 'bg-risk-high text-white hover:bg-red-600',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  default: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange/20 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
