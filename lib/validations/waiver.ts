import { z } from 'zod'

export const waiverSchema = z.object({
  project_id: z.string().uuid(),
  waiver_type: z.enum(['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final']),
  amount: z.coerce.number().positive('Must be a positive number'),
  through_date: z.string().min(1, 'Required'),
  check_maker: z.string().optional().default(''),
  check_amount: z.coerce.number().optional(),
  exceptions: z.string().optional().default(''),
})

export type WaiverFormData = z.infer<typeof waiverSchema>
