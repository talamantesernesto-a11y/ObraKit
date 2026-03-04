import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-navy">
            {label}
            {props.required && <span className="ml-1 text-risk-high">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'input-base',
            error && 'border-risk-high focus:border-risk-high focus:ring-risk-high/20',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-warm-dark">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-risk-high">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
