import { z } from 'zod'

export const contractorSchema = z.object({
  name: z.string().min(1, 'required'),
  contact_name: z.string().optional().default(''),
  contact_email: z.string().email().optional().or(z.literal('')).default(''),
  contact_phone: z.string().optional().default(''),
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  zip: z.string().optional().default(''),
  notes: z.string().optional().default(''),
})

export type ContractorFormData = z.infer<typeof contractorSchema>
