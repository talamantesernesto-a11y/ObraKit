'use client'

import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined
    let mounted = true

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          if (prefersReducedMotion) {
            setCount(target)
            return
          }
          const duration = 1500
          const steps = 40
          const increment = target / steps
          let current = 0
          timerId = setInterval(() => {
            current += increment
            if (current >= target) {
              if (mounted) setCount(target)
              clearInterval(timerId)
            } else {
              if (mounted) setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => {
      mounted = false
      observer.disconnect()
      if (timerId) clearInterval(timerId)
    }
  }, [target])

  return (
    <div ref={ref} className="font-display text-3xl font-bold text-navy sm:text-4xl">
      {count.toLocaleString()}{suffix}
    </div>
  )
}
