import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { ToastProvider } from '@/components/ui/toast'
import { WhatsAppFloat } from '@/components/ui/whatsapp-float'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: company } = await supabase
    .from('companies')
    .select('plan')
    .eq('user_id', user.id)
    .single()

  return (
    <ToastProvider>
      <div className="min-h-screen bg-warm-white">
        <Sidebar userEmail={user.email || ''} plan={company?.plan || 'free'} />
        <main className="lg:pl-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <WhatsAppFloat />
      </div>
    </ToastProvider>
  )
}
