'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

function Dialog({ open, onClose, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        'w-full max-w-lg rounded-xl border border-warm-gray bg-white p-0 shadow-xl backdrop:bg-navy/50 backdrop:backdrop-blur-sm',
        className
      )}
    >
      {open && children}
    </dialog>
  )
}

function DialogHeader({ className, children, onClose, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div className={cn('flex items-center justify-between border-b border-warm-gray p-6', className)} {...props}>
      <div>{children}</div>
      {onClose && (
        <button onClick={onClose} className="rounded-lg p-1 text-warm-dark hover:bg-warm-gray">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold text-navy', className)} {...props} />
}

function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-3 border-t border-warm-gray p-6', className)} {...props} />
}

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter }
