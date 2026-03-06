import { PLANS, type PlanId } from './plans'

interface CompanyForPlanCheck {
  plan: string
  waiver_count_this_month: number
  waiver_count_reset_at: string | null
}

export interface PlanCheckResult {
  allowed: boolean
  reason?: 'waiver_limit' | 'project_limit'
  current: number
  limit: number | null
}

/** Check if the company can create another waiver (includes lazy monthly reset logic) */
export function canCreateWaiver(company: CompanyForPlanCheck): PlanCheckResult {
  const plan = PLANS[company.plan as PlanId] || PLANS.free
  if (!plan.waiverLimit) return { allowed: true, current: company.waiver_count_this_month, limit: null }

  const resetAt = company.waiver_count_reset_at ? new Date(company.waiver_count_reset_at) : new Date(0)
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const effectiveCount = resetAt < firstOfMonth ? 0 : company.waiver_count_this_month

  return {
    allowed: effectiveCount < plan.waiverLimit,
    reason: effectiveCount >= plan.waiverLimit ? 'waiver_limit' : undefined,
    current: effectiveCount,
    limit: plan.waiverLimit,
  }
}

/** Check if the company can create another project */
export function canCreateProject(company: CompanyForPlanCheck, currentProjectCount: number): PlanCheckResult {
  const plan = PLANS[company.plan as PlanId] || PLANS.free
  if (!plan.projectLimit) return { allowed: true, current: currentProjectCount, limit: null }
  return {
    allowed: currentProjectCount < plan.projectLimit,
    reason: currentProjectCount >= plan.projectLimit ? 'project_limit' : undefined,
    current: currentProjectCount,
    limit: plan.projectLimit,
  }
}

/** Check if PDF should have watermark */
export function shouldWatermark(plan: string): boolean {
  return (PLANS[plan as PlanId] || PLANS.free).hasWatermark
}
