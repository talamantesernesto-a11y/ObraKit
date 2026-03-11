import { MarketingHeader } from '@/components/marketing/marketing-header'
import { Footer } from '@/components/marketing/footer'
import { WhatsAppFloat } from '@/components/ui/whatsapp-float'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
