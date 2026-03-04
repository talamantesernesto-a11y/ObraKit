import { createClient } from '@/lib/supabase/server'
import { validateWaiver } from '@/lib/ai/validate-waiver'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await validateWaiver(body)
    return NextResponse.json(result)
  } catch {
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
