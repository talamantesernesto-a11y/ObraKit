'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MarketingHeader() {
  const t = useTranslations('marketing')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.getElementById(href.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { href: '#funciones', label: t('features') },
    { href: '#precios', label: t('pricing') },
    { href: '#estados', label: t('states') },
  ]

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <span className={cn(scrolled ? 'text-navy' : 'text-white')}>Obra</span>
          <span className="text-orange">Kit</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                'text-sm font-medium transition-colors hover:text-orange',
                scrolled ? 'text-navy' : 'text-white/90 hover:text-white'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle
            className={cn(
              scrolled
                ? 'text-warm-dark hover:text-navy'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          />
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                scrolled
                  ? 'text-navy hover:bg-warm-gray/50'
                  : 'text-white hover:bg-white/10'
              )}
            >
              {t('login')}
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="accent" size="sm">
              {t('startFree')}
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            'rounded-lg p-2 md:hidden',
            scrolled ? 'text-navy' : 'text-white'
          )}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile slide-out nav */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between border-b border-warm-gray px-6 py-4">
              <span className="text-xl font-bold">
                <span className="text-navy">Obra</span>
                <span className="text-orange">Kit</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-navy"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-navy transition-colors hover:bg-warm-gray/50"
                >
                  {link.label}
                </a>
              ))}
              <hr className="my-4 border-warm-gray" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-navy transition-colors hover:bg-warm-gray/50"
              >
                {t('login')}
              </Link>
              <div className="mt-2 px-4">
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="accent" className="w-full">
                    {t('startFree')}
                  </Button>
                </Link>
              </div>
              <div className="mt-4 flex justify-center">
                <LanguageToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
