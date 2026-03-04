import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function ProjectsPage() {
  const supabase = createClient()
  const t = await getTranslations('projects')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!company) redirect('/settings')

  const { data: projects } = await supabase
    .from('projects')
    .select('*, general_contractors(name)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  const statusVariant = (s: string): 'signed' | 'generated' | 'sent' | 'draft' => {
    switch (s) {
      case 'active': return 'signed'
      case 'completed': return 'generated'
      case 'on_hold': return 'sent'
      default: return 'draft'
    }
  }

  const statusLabel = (s: string) => {
    switch (s) {
      case 'active': return t('statusActive')
      case 'completed': return t('statusCompleted')
      case 'on_hold': return t('statusOnHold')
      default: return s
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">{t('title')}</h1>
        <Link href="/projects/new">
          <Button variant="accent">
            <Plus className="h-4 w-4" />
            {t('new')}
          </Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="rounded-xl border border-warm-gray bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-navy">{project.name}</h3>
                <Badge variant={statusVariant(project.status)}>
                  {statusLabel(project.status)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-warm-dark">
                {project.city}, {project.state}
              </p>
              {project.general_contractors && (
                <p className="mt-2 text-xs text-warm-dark">
                  GC: {(project.general_contractors as { name: string }).name}
                </p>
              )}
              {project.contract_value && (
                <p className="mt-1 text-sm font-medium text-navy">
                  {formatCurrency(Number(project.contract_value))}
                </p>
              )}
              <p className="mt-2 text-xs text-warm-dark">
                {formatDate(project.created_at)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-warm-gray bg-white p-12 text-center">
          <p className="text-warm-dark">{t('empty')}</p>
          <p className="mt-1 text-sm text-warm-dark">{t('emptyAction')}</p>
          <Link href="/projects/new" className="mt-4 inline-block">
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
