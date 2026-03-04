'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextType {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const icons: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-risk-low bg-risk-low/10 text-risk-low',
  error: 'border-risk-high bg-risk-high/10 text-risk-high',
  warning: 'border-risk-medium bg-risk-medium/10 text-risk-medium',
  info: 'border-status-generated bg-status-generated/10 text-status-generated',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.variant]
          return (
            <div
              key={t.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right',
                variantStyles[t.variant]
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{t.message}</p>
              <button onClick={() => removeToast(t.id)} className="ml-2 shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
