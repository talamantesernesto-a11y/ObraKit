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
export const SUPPORTED_STATES = [
  { value: 'CA', label: 'California' },
  { value: 'GA', label: 'Georgia' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
  { value: 'NY', label: 'New York' },
]
