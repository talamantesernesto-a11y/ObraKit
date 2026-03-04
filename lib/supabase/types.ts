export type Company = {
  id: string
  user_id: string
  name: string
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  email: string | null
  license_number: string | null
  ein: string | null
  language_preference: 'es' | 'en'
  stripe_customer_id: string | null
  plan: 'free' | 'pro' | 'team'
  plan_status: string | null
  waiver_count_this_month: number
  waiver_count_reset_at: string | null
  created_at: string
  updated_at: string
}

export type GeneralContractor = {
  id: string
  company_id: string
  name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  notes: string | null
  created_at: string
}

export type Project = {
  id: string
  company_id: string
  gc_id: string | null
  name: string
  address: string
  city: string | null
  state: string
  zip: string | null
  owner_name: string | null
  contract_value: number | null
  retention_percentage: number
  start_date: string | null
  status: 'active' | 'completed' | 'on_hold'
  created_at: string
  updated_at: string
  // Joined relations
  general_contractors?: GeneralContractor | null
}

export type WaiverType =
  | 'conditional_progress'
  | 'unconditional_progress'
  | 'conditional_final'
  | 'unconditional_final'

export type WaiverStatus = 'draft' | 'generated' | 'sent' | 'signed' | 'countersigned'

export type Waiver = {
  id: string
  project_id: string
  company_id: string
  waiver_type: WaiverType
  state: string
  amount: number
  through_date: string
  check_maker: string | null
  check_amount: number | null
  exceptions: string | null
  status: WaiverStatus
  pdf_url: string | null
  signature_request_id: string | null
  signed_at: string | null
  sent_at: string | null
  sent_to_email: string | null
  ai_validation_result: Record<string, unknown> | null
  ai_validated_at: string | null
  created_at: string
  updated_at: string
  // Joined relations
  projects?: Project | null
}
