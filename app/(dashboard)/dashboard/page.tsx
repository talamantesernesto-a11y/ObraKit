import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { RecentWaivers } from '@/components/dashboard/recent-waivers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const t = await getTranslations('dashboard')
  const locale = await getLocale()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If no company profile, redirect to setup
  if (!company) {
    redirect('/settings')
  }

  // Get stats
  const { count: activeProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .eq('status', 'active')

  const { count: waiversThisMonth } = await supabase
    .from('waivers')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

  const { count: pendingWaivers } = await supabase
    .from('waivers')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .in('status', ['draft', 'generated'])

  const { count: waiversSent } = await supabase
    .from('waivers')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .eq('status', 'sent')

  const { count: waiversSigned } = await supabase
    .from('waivers')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .eq('status', 'signed')

  const { data: waiverSums } = await supabase
    .from('waivers')
    .select('amount')
    .eq('company_id', company.id)

  const totalBilled = waiverSums?.reduce((sum, w) => sum + Number(w.amount), 0) || 0

  // Recent projects
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*, general_contractors(name)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Recent waivers
  const { data: recentWaivers } = await supabase
    .from('waivers')
    .select('id, waiver_type, amount, status, created_at, project_id, projects(name)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            {t('welcome', { name: company.name })}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/waivers">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4" />
              {t('viewAllWaivers')}
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button variant="accent" size="sm">
              <Plus className="h-4 w-4" />
              {t('newProject')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <StatsOverview
        activeProjects={activeProjects || 0}
        waiversThisMonth={waiversThisMonth || 0}
        pendingWaivers={pendingWaivers || 0}
        totalBilled={totalBilled}
        waiversSent={waiversSent || 0}
        waiversSigned={waiversSigned || 0}
      />

      {/* Recent Projects */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-navy">{t('recentProjects')}</h2>
        {recentProjects && recentProjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="rounded-xl border border-warm-gray bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-navy">{project.name}</h3>
                <p className="mt-1 text-sm text-warm-dark">
                  {project.city}, {project.state}
                </p>
                {project.general_contractors && (
                  <p className="mt-2 text-xs text-warm-dark">
                    GC: {(project.general_contractors as { name: string }).name}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-warm-gray bg-white p-12 text-center">
            <p className="text-warm-dark">{t('noProjects')}</p>
            <p className="mt-1 text-sm text-warm-dark">{t('createFirst')}</p>
          </div>
        )}
      </div>

      {/* Recent Waivers */}
      {recentWaivers && recentWaivers.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">{t('recentWaivers')}</h2>
            <Link href="/waivers" className="text-sm text-orange hover:underline">
              {t('viewAllWaivers')}
            </Link>
          </div>
          <RecentWaivers waivers={recentWaivers as any} locale={locale} />
        </div>
      )}
    </div>
  )
}
