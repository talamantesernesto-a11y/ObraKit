import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-navy">
            {label}
            {props.required && <span className="ml-1 text-risk-high">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'input-base',
            error && 'border-risk-high focus:border-risk-high focus:ring-risk-high/20',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-risk-high">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
