import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(1, 'required'),
  address: z.string().min(1, 'required'),
  city: z.string().min(1, 'required'),
  state: z.string().length(2, 'required'),
  zip: z.string().min(5, 'required'),
  owner_name: z.string().optional().default(''),
  gc_id: z.string().uuid().optional().nullable().or(z.literal('')),
  contract_value: z.coerce.number().positive().optional().or(z.literal(0)).default(0),
  retention_percentage: z.coerce.number().min(0).max(100).default(10),
  start_date: z.string().optional().default(''),
  status: z.enum(['active', 'completed', 'on_hold']).default('active'),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// States supported for waiver generation
// Tier 1: CA, TX, FL, GA, NY (original)
// Tier 2: AZ, NV, CO, IL, NJ (expansion — March 2026)
export const SUPPORTED_STATES = [
  { value: 'AZ', label: 'Arizona' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'IL', label: 'Illinois' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
]
