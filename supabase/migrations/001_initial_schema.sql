-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- COMPANIES (the subcontractor's business)
create table companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip text,
  phone text,
  email text,
  license_number text,
  ein text,
  language_preference text default 'es' check (language_preference in ('es', 'en')),
  stripe_customer_id text,
  plan text default 'free' check (plan in ('free', 'pro', 'team')),
  plan_status text default 'active',
  waiver_count_this_month int default 0,
  waiver_count_reset_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- GENERAL CONTRACTORS (the GCs the sub works with)
create table general_contractors (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  address text,
  city text,
  state text,
  zip text,
  notes text,
  created_at timestamptz default now()
);

-- PROJECTS
create table projects (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  gc_id uuid references general_contractors(id),
  name text not null,
  address text not null,
  city text,
  state text not null,
  zip text,
  owner_name text,
  contract_value numeric(12,2),
  retention_percentage numeric(5,2) default 10,
  start_date date,
  status text default 'active' check (status in ('active', 'completed', 'on_hold')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- WAIVERS
create table waivers (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  company_id uuid references companies(id) on delete cascade not null,
  waiver_type text not null check (waiver_type in (
    'conditional_progress',
    'unconditional_progress',
    'conditional_final',
    'unconditional_final'
  )),
  state text not null,
  amount numeric(12,2) not null,
  through_date date not null,
  check_maker text,
  check_amount numeric(12,2),
  exceptions text,
  status text default 'draft' check (status in (
    'draft',
    'generated',
    'sent',
    'signed',
    'countersigned'
  )),
  pdf_url text,
  signature_request_id text,
  signed_at timestamptz,
  sent_at timestamptz,
  sent_to_email text,
  ai_validation_result jsonb,
  ai_validated_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ROW-LEVEL SECURITY
alter table companies enable row level security;
alter table general_contractors enable row level security;
alter table projects enable row level security;
alter table waivers enable row level security;

-- Companies: users access only their own
create policy "Users can view own company"
  on companies for select using (user_id = auth.uid());
create policy "Users can update own company"
  on companies for update using (user_id = auth.uid());
create policy "Users can insert own company"
  on companies for insert with check (user_id = auth.uid());

-- GCs: access scoped to user's company
create policy "Users can manage own GCs"
  on general_contractors for all
  using (company_id in (select id from companies where user_id = auth.uid()))
  with check (company_id in (select id from companies where user_id = auth.uid()));

-- Projects: access scoped to user's company
create policy "Users can manage own projects"
  on projects for all
  using (company_id in (select id from companies where user_id = auth.uid()))
  with check (company_id in (select id from companies where user_id = auth.uid()));

-- Waivers: access scoped to user's company
create policy "Users can manage own waivers"
  on waivers for all
  using (company_id in (select id from companies where user_id = auth.uid()))
  with check (company_id in (select id from companies where user_id = auth.uid()));

-- INDEXES
create index idx_companies_user on companies(user_id);
create index idx_projects_company on projects(company_id);
create index idx_waivers_project on waivers(project_id);
create index idx_waivers_company on waivers(company_id);
create index idx_waivers_status on waivers(status);
create index idx_gc_company on general_contractors(company_id);

-- STORAGE BUCKET for PDFs
-- Run via Supabase dashboard: create bucket 'waivers' (public: false)
