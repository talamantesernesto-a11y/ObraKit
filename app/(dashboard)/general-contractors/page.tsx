import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Users, Mail, Phone, Pencil } from 'lucide-react'

export default async function ContractorsPage() {
  const supabase = createClient()
  const t = await getTranslations('contractors')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!company) redirect('/settings')

  const { data: contractors } = await supabase
    .from('general_contractors')
    .select('*')
    .eq('company_id', company.id)
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">{t('title')}</h1>
        <Link href="/general-contractors/new">
          <Button variant="accent">
            <Plus className="h-4 w-4" />
            {t('new')}
          </Button>
        </Link>
      </div>

      {contractors && contractors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contractors.map((gc) => (
            <Card key={gc.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-warm-gray/50 p-2 text-navy">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy">{gc.name}</h3>
                    {gc.contact_name && (
                      <p className="mt-1 text-sm text-warm-dark">{gc.contact_name}</p>
                    )}
                    {gc.contact_email && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-warm-dark">
                        <Mail className="h-3 w-3" />
                        {gc.contact_email}
                      </p>
                    )}
                    {gc.contact_phone && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-warm-dark">
                        <Phone className="h-3 w-3" />
                        {gc.contact_phone}
                      </p>
                    )}
                  </div>
                  <Link href={`/general-contractors/${gc.id}/edit`} className="shrink-0">
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-warm-gray bg-white p-12 text-center">
          <p className="text-warm-dark">{t('empty')}</p>
          <p className="mt-1 text-sm text-warm-dark">{t('emptyAction')}</p>
          <Link href="/general-contractors/new" className="mt-4 inline-block">
            <Button variant="accent">
              <Plus className="h-4 w-4" />
              {t('new')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
