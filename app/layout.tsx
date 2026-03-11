import type { Metadata } from 'next'
import { DM_Sans, Source_Sans_3 } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://obrakit.ai'),
  title: {
    default: 'ObraKit — Lien Waivers para Subcontratistas',
    template: '%s | ObraKit',
  },
  description: 'Genera lien waivers legales en minutos. En español, desde tu teléfono. Hecho para subcontratistas latinos.',
  twitter: {
    card: 'summary_large_image',
    site: '@obrakit',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ObraKit',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${dmSans.variable} ${sourceSans.variable} font-body`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
