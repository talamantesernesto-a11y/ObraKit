# ObraKit PRD — Lien Waiver MVP

> **Domain:** obrakit.ai
> **Stack:** Next.js 14 (App Router) + Tailwind CSS + Supabase + Claude Sonnet API + React-PDF + Stripe + Resend
> **Deploy:** Vercel
> **Language:** TypeScript throughout
> **Target:** 4-week build to first paying customer

---

## 1. What ObraKit Does

ObraKit generates state-compliant lien waivers for Latino subcontractors in the U.S. The interface is bilingual (Spanish primary, English toggle). The generated PDFs are in English and look indistinguishable from standard industry forms. The user picks a waiver type, fills in project details, and ObraKit outputs a legally correct, ready-to-sign PDF.

### Core User Flow

```
1. Sub signs up (email + password) → company profile wizard (bilingual)
2. Sub adds a project (name, address, state, GC info, contract value)
3. Sub clicks "New Waiver" → wizard:
   a. Select waiver type (4 options with Spanish explanations of risk)
   b. Fill payment details (amount, through-date, check maker)
   c. AI validates inputs (Claude checks for common errors)
   d. Preview PDF
   e. Sign (Dropbox Sign) + Send to GC (email) OR Download PDF
4. Dashboard shows all projects, pending waivers, payment status
```

---

## 2. Tech Stack — Exact Packages

```json
{
  "dependencies": {
    "next": "^14.2",
    "react": "^18.3",
    "react-dom": "^18.3",
    "@supabase/supabase-js": "^2.45",
    "@supabase/ssr": "^0.5",
    "@react-pdf/renderer": "^3.4",
    "@anthropic-ai/sdk": "^0.30",
    "stripe": "^16",
    "@stripe/stripe-js": "^4",
    "resend": "^4",
    "date-fns": "^3",
    "zod": "^3.23",
    "react-hook-form": "^7.53",
    "@hookform/resolvers": "^3.9",
    "lucide-react": "^0.400",
    "next-intl": "^3.20",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "typescript": "^5.5",
    "@types/react": "^18",
    "@types/node": "^22",
    "tailwindcss": "^3.4",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "^14"
  }
}
```

---

## 3. Project Structure

```
obrakit/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar + topbar + language toggle
│   │   ├── page.tsx                    # Dashboard home (project overview)
│   │   ├── projects/
│   │   │   ├── page.tsx                # All projects list
│   │   │   ├── new/page.tsx            # Create project form
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Single project detail
│   │   │       └── waivers/
│   │   │           └── new/page.tsx    # Waiver wizard (multi-step)
│   │   ├── waivers/
│   │   │   └── page.tsx                # All waivers across projects
│   │   ├── general-contractors/
│   │   │   ├── page.tsx                # GC directory
│   │   │   └── new/page.tsx            # Add GC form
│   │   └── settings/
│   │       ├── page.tsx                # Company profile
│   │       └── billing/page.tsx        # Stripe subscription management
│   ├── (marketing)/
│   │   ├── layout.tsx                  # Marketing site layout
│   │   ├── page.tsx                    # Landing page (bilingual)
│   │   ├── pricing/page.tsx
│   │   └── lien-waivers/
│   │       ├── page.tsx                # Hub page: what are lien waivers
│   │       ├── [state]/page.tsx        # State-specific guide (SSG)
│   │       └── templates/page.tsx      # Free downloadable templates (lead magnet)
│   ├── api/
│   │   ├── waivers/
│   │   │   ├── generate/route.ts       # Generate waiver PDF
│   │   │   ├── validate/route.ts       # Claude AI validation
│   │   │   └── send/route.ts           # Email waiver to GC
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   └── auth/
│   │       └── callback/route.ts       # Supabase auth callback
│   ├── layout.tsx                       # Root layout
│   └── globals.css
├── components/
│   ├── ui/                              # Shared UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   └── language-toggle.tsx
│   ├── waiver-wizard/
│   │   ├── step-type-select.tsx         # Step 1: Choose waiver type
│   │   ├── step-details.tsx             # Step 2: Project & payment details
│   │   ├── step-review.tsx              # Step 3: AI validation + review
│   │   ├── step-sign-send.tsx           # Step 4: Sign + send/download
│   │   └── waiver-risk-badge.tsx        # Risk indicator component
│   ├── dashboard/
│   │   ├── project-card.tsx
│   │   ├── waiver-status-badge.tsx
│   │   ├── stats-overview.tsx
│   │   └── sidebar.tsx
│   └── pdf/
│       ├── waiver-pdf.tsx               # React-PDF waiver template
│       ├── california-waiver.tsx        # CA statutory form layout
│       ├── georgia-waiver.tsx           # GA statutory form layout
│       └── generic-waiver.tsx           # TX, FL, NY custom form layout
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # Browser client
│   │   ├── server.ts                    # Server client
│   │   └── middleware.ts                # Auth middleware
│   ├── stripe.ts                        # Stripe config
│   ├── resend.ts                        # Email config
│   ├── ai/
│   │   ├── validate-waiver.ts           # Claude validation prompt
│   │   └── client.ts                    # Anthropic client setup
│   ├── waivers/
│   │   ├── types.ts                     # Waiver type definitions
│   │   ├── state-rules.ts              # State compliance rules engine
│   │   └── generate-pdf.ts             # PDF generation orchestrator
│   └── i18n/
│       ├── es.json                      # Spanish translations
│       ├── en.json                      # English translations
│       └── config.ts                    # next-intl config
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql       # Database schema
├── middleware.ts                         # Auth + i18n middleware
├── tailwind.config.ts
├── next.config.js
└── .env.local.example
```

---

## 4. Database Schema

```sql
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
  owner_name text,                          -- property owner
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

  -- Waiver type: the 4 standard types
  waiver_type text not null check (waiver_type in (
    'conditional_progress',
    'unconditional_progress',
    'conditional_final',
    'unconditional_final'
  )),

  -- State determines which form template to use
  state text not null,

  -- Payment details
  amount numeric(12,2) not null,
  through_date date not null,
  check_maker text,                         -- who is issuing the check
  check_amount numeric(12,2),               -- for conditional: expected amount

  -- Exceptions (items NOT included in this waiver)
  exceptions text,                          -- free text for disputed/excluded items

  -- Status tracking
  status text default 'draft' check (status in (
    'draft',
    'generated',
    'sent',
    'signed',
    'countersigned'
  )),

  -- PDF storage
  pdf_url text,                             -- Supabase Storage URL

  -- E-signature tracking
  signature_request_id text,                -- Dropbox Sign request ID
  signed_at timestamptz,
  sent_at timestamptz,
  sent_to_email text,                       -- GC email it was sent to

  -- AI validation
  ai_validation_result jsonb,               -- validation warnings/errors from Claude
  ai_validated_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ROW-LEVEL SECURITY
alter table companies enable row level security;
alter table general_contractors enable row level security;
alter table projects enable row level security;
alter table waivers enable row level security;

-- Policies: users can only access their own company's data
create policy "Users can view own company"
  on companies for select using (user_id = auth.uid());
create policy "Users can update own company"
  on companies for update using (user_id = auth.uid());
create policy "Users can insert own company"
  on companies for insert with check (user_id = auth.uid());

create policy "Users can view own GCs"
  on general_contractors for select
  using (company_id in (select id from companies where user_id = auth.uid()));
create policy "Users can manage own GCs"
  on general_contractors for all
  using (company_id in (select id from companies where user_id = auth.uid()));

create policy "Users can view own projects"
  on projects for select
  using (company_id in (select id from companies where user_id = auth.uid()));
create policy "Users can manage own projects"
  on projects for all
  using (company_id in (select id from companies where user_id = auth.uid()));

create policy "Users can view own waivers"
  on waivers for select
  using (company_id in (select id from companies where user_id = auth.uid()));
create policy "Users can manage own waivers"
  on waivers for all
  using (company_id in (select id from companies where user_id = auth.uid()));

-- INDEXES
create index idx_projects_company on projects(company_id);
create index idx_waivers_project on waivers(project_id);
create index idx_waivers_company on waivers(company_id);
create index idx_waivers_status on waivers(status);
create index idx_gc_company on general_contractors(company_id);

-- STORAGE BUCKET for PDFs
-- Run via Supabase dashboard: create bucket 'waivers' (public: false)
```

---

## 5. State Compliance Rules Engine

```typescript
// lib/waivers/state-rules.ts

export type StateWaiverRule = {
  state: string;
  stateName: string;
  hasStatutoryForm: boolean;
  statuteReference: string;
  waiverTypes: ('conditional_progress' | 'unconditional_progress' | 'conditional_final' | 'unconditional_final')[];
  requiresNotarization: boolean;
  notes: string;
  requiredFields: string[];
  warningText: Record<string, string>; // waiver_type -> statutory warning text
};

export const STATE_RULES: Record<string, StateWaiverRule> = {
  CA: {
    state: 'CA',
    stateName: 'California',
    hasStatutoryForm: true,
    statuteReference: 'Cal. Civ. Code §§ 8132-8138',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'California requires statutory forms. Waivers must be in "substantially" the form provided. Each form has mandatory NOTICE text that must appear in type at least as large as the largest type in the form.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount', 'check_maker', 'exceptions'],
    warningText: {
      conditional_progress: 'NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT\'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.',
      unconditional_progress: 'NOTICE: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.',
      conditional_final: 'NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT\'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.',
      unconditional_final: 'NOTICE: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.'
    }
  },
  GA: {
    state: 'GA',
    stateName: 'Georgia',
    hasStatutoryForm: true,
    statuteReference: 'O.C.G.A. § 44-14-366',
    waiverTypes: ['conditional_progress', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'Georgia uses "Interim Waiver" (progress) and "Final Waiver" forms. The interim waiver is automatically conditional for 90 days, then converts to unconditional unless an Affidavit of Nonpayment is filed. Must be in at least 12pt font. 2021 amendments narrowed scope to lien and bond rights only.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {
      conditional_progress: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY TO THE EXTENT (AND ONLY TO THE EXTENT) SET FORTH ABOVE, EVEN IF YOU HAVE NOT ACTUALLY RECEIVED SUCH PAYMENT, 90 DAYS AFTER THE DATE STATED ABOVE UNLESS YOU FILE AN AFFIDAVIT OF NONPAYMENT PRIOR TO THE EXPIRATION OF SUCH 90 DAY PERIOD.',
      unconditional_final: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY.'
    }
  },
  TX: {
    state: 'TX',
    stateName: 'Texas',
    hasStatutoryForm: false,
    statuteReference: 'Tex. Prop. Code §§ 53.281-53.286',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'Texas does not have statutory waiver forms. However, Texas Property Code governs mechanic\'s liens. Waivers must clearly identify the project, amount, and scope of rights being waived. Use ObraKit standard form with required legal language.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {}
  },
  FL: {
    state: 'FL',
    stateName: 'Florida',
    hasStatutoryForm: false,
    statuteReference: 'Fla. Stat. §§ 713.01-713.37',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'Florida does not have statutory waiver forms but has detailed lien law (Construction Lien Law, Part I Chapter 713). Waivers are enforceable if properly executed. Use ObraKit standard form. Note: Florida requires a Notice to Owner (NTO) within 45 days of first furnishing for subs not in privity with owner.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {}
  },
  NY: {
    state: 'NY',
    stateName: 'New York',
    hasStatutoryForm: false,
    statuteReference: 'N.Y. Lien Law §§ 3-39-a',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'New York does not have statutory waiver forms. Mechanic\'s Lien Law governs. Waivers are generally enforceable. However, NY Lien Law § 34 limits the ability to waive lien rights in advance on certain projects. Use ObraKit standard form with appropriate language.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {}
  }
};
```

---

## 6. AI Validation Prompt

```typescript
// lib/ai/validate-waiver.ts

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export type ValidationResult = {
  isValid: boolean;
  errors: { field: string; message_en: string; message_es: string }[];
  warnings: { field: string; message_en: string; message_es: string }[];
};

export async function validateWaiver(input: {
  waiverType: string;
  state: string;
  amount: number;
  throughDate: string;
  projectContractValue: number;
  totalPreviouslyBilled: number;
  isFinalPayment: boolean;
  hasRetention: boolean;
  retentionPercentage: number;
}): Promise<ValidationResult> {
  const prompt = `You are a construction lien waiver validation engine. Analyze the following waiver details and return a JSON object with errors and warnings.

WAIVER DETAILS:
- Type: ${input.waiverType}
- State: ${input.state}
- Amount: $${input.amount}
- Through Date: ${input.throughDate}
- Contract Value: $${input.projectContractValue}
- Total Previously Billed: $${input.totalPreviouslyBilled}
- Is Final Payment: ${input.isFinalPayment}
- Has Retention: ${input.hasRetention}
- Retention %: ${input.retentionPercentage}%

CHECK FOR:
1. If waiver type is "unconditional" but this appears to be a progress payment (not final), warn that the sub is waiving rights before confirming payment receipt
2. If amount exceeds remaining contract value (contract - previously billed), flag as error
3. If through_date is in the future, warn (unusual but not necessarily wrong)
4. If type is "final" but amount doesn't equal remaining balance, warn
5. If unconditional and amount is large (>$50k), extra warning about risk
6. If retention exists but final waiver doesn't account for it, warn
7. State-specific checks for ${input.state}

Respond ONLY with valid JSON in this exact format:
{
  "isValid": boolean,
  "errors": [{"field": "string", "message_en": "string", "message_es": "string"}],
  "warnings": [{"field": "string", "message_en": "string", "message_es": "string"}]
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as ValidationResult;
}
```

---

## 7. Waiver Type Definitions with Spanish Explanations

```typescript
// lib/waivers/types.ts

export const WAIVER_TYPES = {
  conditional_progress: {
    id: 'conditional_progress',
    name_en: 'Conditional Waiver and Release on Progress Payment',
    name_es: 'Renuncia Condicional — Pago Parcial',
    description_en: 'Use when you are submitting a progress payment request and have NOT yet received payment. Your lien rights are only waived IF and WHEN payment clears.',
    description_es: 'Usa este cuando pides un pago parcial y AUN NO te han pagado. Tus derechos de lien solo se pierden SI y CUANDO el pago se haga efectivo. Si no te pagan, conservas todos tus derechos.',
    risk_level: 'low' as const,
    risk_label_es: 'Riesgo Bajo — Tus derechos están protegidos hasta que recibas el pago',
    risk_label_en: 'Low Risk — Your rights are protected until payment is received',
    icon: 'shield-check',
  },
  unconditional_progress: {
    id: 'unconditional_progress',
    name_en: 'Unconditional Waiver and Release on Progress Payment',
    name_es: 'Renuncia Incondicional — Pago Parcial',
    description_en: 'Use ONLY when you have already received and deposited a progress payment. This waiver takes effect IMMEDIATELY upon signing, whether or not the check clears.',
    description_es: 'Usa este SOLO cuando YA recibiste y depositaste un pago parcial. Esta renuncia es efectiva INMEDIATAMENTE al firmar, aunque el cheque no se haga efectivo. NO firmes esto si no tienes el dinero en tu cuenta.',
    risk_level: 'medium' as const,
    risk_label_es: 'Riesgo Medio — Asegúrate de tener el pago en mano antes de firmar',
    risk_label_en: 'Medium Risk — Make sure you have payment in hand before signing',
    icon: 'alert-triangle',
  },
  conditional_final: {
    id: 'conditional_final',
    name_en: 'Conditional Waiver and Release on Final Payment',
    name_es: 'Renuncia Condicional — Pago Final',
    description_en: 'Use when requesting your final payment on a project and have NOT yet received it. Your lien rights are only waived IF and WHEN final payment clears.',
    description_es: 'Usa este cuando pides tu pago FINAL del proyecto y AUN NO te han pagado. Tus derechos solo se pierden cuando recibas el pago completo. Si no te pagan, conservas tus derechos.',
    risk_level: 'low' as const,
    risk_label_es: 'Riesgo Bajo — Protegido hasta recibir el pago final',
    risk_label_en: 'Low Risk — Protected until final payment is received',
    icon: 'shield-check',
  },
  unconditional_final: {
    id: 'unconditional_final',
    name_en: 'Unconditional Waiver and Release on Final Payment',
    name_es: 'Renuncia Incondicional — Pago Final',
    description_en: 'Use ONLY when you have received your complete final payment. This permanently waives ALL lien rights on the project. There is no going back.',
    description_es: 'Usa este SOLO cuando YA recibiste tu pago final COMPLETO. Esto elimina PERMANENTEMENTE todos tus derechos de lien en el proyecto. NO HAY VUELTA ATRÁS. No firmes esto si te deben cualquier cantidad.',
    risk_level: 'high' as const,
    risk_label_es: 'Riesgo Alto — Pierdes TODOS tus derechos permanentemente. Solo firma si ya tienes todo tu dinero.',
    risk_label_en: 'High Risk — You permanently lose ALL rights. Only sign if fully paid.',
    icon: 'alert-octagon',
  },
} as const;
```

---

## 8. PDF Generation Templates

Three PDF template types needed:

### 8a. California Statutory Form (mandatory format)
Must include exact statutory language from Civil Code §§ 8132/8134/8136/8138. The NOTICE text must be in type "at least as large as the largest type otherwise in the form." Use React-PDF to generate. Fields: Name of Claimant, Name of Customer, Job Location, Owner, Through Date, Amount of Check ($), Maker of Check, Exceptions, Signature, Date.

### 8b. Georgia Statutory Form (mandatory format)
Must follow O.C.G.A. § 44-14-366 format. Must be at least 12pt font. Georgia has two forms: Interim (progress) and Final. Both include the statutory NOTICE text. The interim waiver is conditional for 90 days, then auto-converts. Fields: Contractor/Claimant Name, Owner, Property Description, Through Date, Amount, Signature, Date.

### 8c. Generic Form (TX, FL, NY, all other states)
ObraKit standard professional form. Clean layout matching industry expectations. Includes: project identification, parties, waiver type, amount, through date, exceptions section, conditional/unconditional language, signature block. Must look like a form a construction attorney would produce.

**All PDFs must include:**
- Professional letterhead area (sub's company name and address)
- Clear title identifying the waiver type
- All legally required fields for the state
- Signature and date lines
- Small footer: "Generated by ObraKit.ai"

---

## 9. Internationalization (i18n)

Use `next-intl` for bilingual support. Default locale: `es`. Available: `es`, `en`.

Key translation areas:
- All UI labels, buttons, navigation
- Waiver type names and descriptions (see section 7)
- Risk warnings and explanations
- Validation error messages (from Claude, always bilingual)
- Dashboard labels and status indicators
- Onboarding wizard

**Critical rule:** Generated PDF content is ALWAYS in English (GCs expect English documents). The Spanish is only for the user interface and explanations.

---

## 10. Stripe Billing

### Plans
| Plan | Stripe Price ID | Monthly | Waiver Limit |
|------|----------------|---------|--------------|
| Free | (no subscription) | $0 | 3/month |
| Pro | price_pro_monthly | $39 | Unlimited |
| Team | price_team_monthly | $79 | Unlimited |

### Free Tier Logic
- Track `waiver_count_this_month` on companies table
- Reset counter on 1st of each month (cron or check on waiver creation)
- When count >= 3 and plan = 'free', show upgrade prompt
- Free PDFs include "Generated by ObraKit.ai" watermark in footer
- Pro/Team PDFs have clean footer or sub's own branding

### Stripe Integration
- Checkout Session for initial subscription
- Customer Portal for plan management
- Webhook for subscription status updates (`invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`)

---

## 11. Email Templates

### Waiver Delivery Email (sent to GC)
```
Subject: Lien Waiver — {project_name} — {waiver_type_name} — {through_date}

Body:
Dear {gc_contact_name},

Please find attached the {waiver_type_name} for {project_name} through {through_date} in the amount of ${amount}.

Submitted by:
{sub_company_name}
{sub_address}
{sub_phone}

[View and Countersign] (link to e-signature if applicable)

This waiver was generated using ObraKit (obrakit.ai).
```

---

## 12. SEO Content Pages (Static Generation)

Generate at build time using `generateStaticParams()`:

### State Guide Pages (`/lien-waivers/[state]`)
For each of the 5 launch states, generate a comprehensive bilingual guide:
- URL: `/lien-waivers/california`, `/lien-waivers/texas`, etc.
- Content: What are lien waivers in {state}, the 4 types explained, state-specific requirements, common mistakes, deadlines, free template download CTA
- Each page ~2,000 words, bilingual toggle
- Schema.org FAQ markup for rich snippets
- Internal links to signup

---

## 13. Environment Variables

```env
# .env.local.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_TEAM=

# Resend (email)
RESEND_API_KEY=
EMAIL_FROM=waivers@obrakit.ai

# Dropbox Sign (e-signatures) — Phase 1.5, start without
DROPBOX_SIGN_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://obrakit.ai
```

---

## 14. Design Tokens

```typescript
// tailwind.config.ts colors
const colors = {
  navy: {
    DEFAULT: '#1B2A4A',
    light: '#2A3F6A',
    dark: '#111C33',
  },
  orange: {
    DEFAULT: '#E8702A',
    light: '#F09050',
    dark: '#C55A1A',
  },
  warm: {
    white: '#F7F5F2',
    gray: '#E8E6E3',
    dark: '#666666',
  },
  risk: {
    low: '#22C55E',      // green
    medium: '#F59E0B',   // amber
    high: '#EF4444',     // red
  },
  status: {
    draft: '#94A3B8',
    generated: '#3B82F6',
    sent: '#F59E0B',
    signed: '#22C55E',
  }
};
```

---

## 15. Build Sequence (Sprint-by-Sprint)

### Sprint 1 — Foundation (Days 1-5)
1. `npx create-next-app@latest obrakit --typescript --tailwind --app`
2. Supabase project setup + database migration (section 4)
3. Auth flow: signup, login, magic link, middleware
4. Company profile wizard (bilingual form)
5. Dashboard layout: sidebar, topbar, language toggle
6. Basic responsive design with brand colors

### Sprint 2 — Core Waiver Engine (Days 6-10)
1. Project CRUD (create, list, detail views)
2. GC management (add, list, select in project)
3. Waiver wizard — 4 steps (section 6 flow)
4. State rules engine (section 5)
5. Claude validation integration (section 6)
6. PDF generation — California statutory form first, then generic
7. Waiver list view with status badges

### Sprint 3 — Billing + Email (Days 11-15)
1. Stripe integration (checkout, portal, webhooks)
2. Free tier enforcement (3 waivers/month limit)
3. Email delivery (Resend) — send waiver PDF to GC
4. PDF download option (for subs who prefer to send manually)
5. Georgia statutory form PDF template
6. Dashboard stats (waivers this month, pending payments, projects)

### Sprint 4 — Launch (Days 16-20)
1. Landing page (bilingual, conversion-optimized)
2. Pricing page
3. 5 state SEO guide pages (CA, TX, FL, GA, NY)
4. Free template download page (lead magnet with email capture)
5. Production deployment on Vercel
6. DNS setup for obrakit.ai
7. Analytics (Vercel Analytics or Plausible)
8. Beta outreach to 10 target subs

---

## 16. Post-MVP Priorities (Weeks 5-8)

1. **E-signature integration** (Dropbox Sign API) — allows GCs to countersign digitally
2. **Pay Application generator** (AIA G702/G703-equivalent) — biggest upsell feature
3. **QuickBooks Online integration** — import project/payment data
4. **GC portal** (free for GCs) — GCs can view and manage waivers from their subs, creates network effect
5. **Remaining 45 states** — add compliance rules progressively based on user demand
6. **WhatsApp notifications** — waiver status updates via WhatsApp (Twilio)
7. **Mobile optimization pass** — ensure wizard works perfectly on phone
8. **Referral program** — 1 free month for each referral

---

## 17. Critical Implementation Notes

### PDF Quality is Non-Negotiable
The #1 reason this product fails is if GCs reject the PDFs. Every PDF must look like it came from a construction attorney's office. Test each template by sending to 3+ GCs and asking "would you accept this?" before launch.

### Spanish UX is Not a Translation
Don't build in English and translate. Build in Spanish first. The primary user thinks in Spanish. Every button label, every error message, every tooltip — write it in natural Spanish first, then add English as the secondary language.

### Waiver Accuracy Over Features
It is better to launch with 2 states perfectly correct than 50 states with errors. A single incorrect waiver could cost a sub their lien rights (tens or hundreds of thousands of dollars). Validate every template against the actual state statute. Budget $2-5K for a construction attorney to review the 5 priority state templates before public launch.

### Free Tier is the Funnel
The free tier (3 waivers/month) is not charity — it's the conversion engine. Make the free experience excellent. The upgrade trigger is when the sub needs their 4th waiver in a month (which means they have enough projects to justify paying).
