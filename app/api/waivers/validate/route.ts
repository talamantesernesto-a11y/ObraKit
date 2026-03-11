import { createClient } from '@/lib/supabase/server'
import { validateWaiver } from '@/lib/ai/validate-waiver'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const validateSchema = z.object({
  waiverType: z.string().min(1).max(100),
  state: z.string().min(2).max(50),
  amount: z.number().min(0).max(100_000_000),
  throughDate: z.string().max(20),
  projectContractValue: z.number().min(0).max(100_000_000),
  totalPreviouslyBilled: z.number().min(0).max(100_000_000),
  isFinalPayment: z.boolean(),
  hasRetention: z.boolean(),
  retentionPercentage: z.number().min(0).max(100),
})

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = validateSchema.parse(body)
    const result = await validateWaiver(validated)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({
      isValid: true,
      errors: [],
      warnings: [{
        field: 'general',
        message_en: 'AI validation unavailable',
        message_es: 'Validación AI no disponible',
      }],
    })
  }
}
