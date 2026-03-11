import { anthropic } from './client'
import { checkStateCompliance, getStateRule } from '@/lib/waivers/state-rules'
import type { WaiverTypeId } from '@/lib/waivers/types'

export type ValidationResult = {
  isValid: boolean
  errors: { field: string; message_en: string; message_es: string }[]
  warnings: { field: string; message_en: string; message_es: string }[]
}

type ValidationInput = {
  waiverType: string
  state: string
  amount: number
  throughDate: string
  projectContractValue: number
  totalPreviouslyBilled: number
  isFinalPayment: boolean
  hasRetention: boolean
  retentionPercentage: number
}

/**
 * Deterministic pre-checks that run instantly before the AI call.
 * Catches obvious issues without spending API credits.
 */
function runDeterministicChecks(input: ValidationInput): ValidationResult {
  const errors: ValidationResult['errors'] = []
  const warnings: ValidationResult['warnings'] = []

  const stateRule = getStateRule(input.state)
  const compliance = checkStateCompliance(input.state, input.waiverType as WaiverTypeId)

  // 1. Amount must be positive
  if (input.amount <= 0) {
    errors.push({
      field: 'amount',
      message_en: 'Payment amount must be greater than zero.',
      message_es: 'El monto del pago debe ser mayor que cero.',
    })
  }

  // 2. Advance waiver detection
  const throughDate = new Date(input.throughDate + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (throughDate > today) {
    if (compliance.prohibitsAdvanceWaivers) {
      errors.push({
        field: 'throughDate',
        message_en: `Through-date is in the future. ${stateRule?.stateName || input.state} law prohibits advance waivers — this waiver would be void and unenforceable.`,
        message_es: `La fecha es en el futuro. La ley de ${stateRule?.stateName || input.state} prohibe waivers anticipados — este waiver seria nulo e inaplicable.`,
      })
    } else {
      warnings.push({
        field: 'throughDate',
        message_en: 'Through-date is in the future. This is unusual and may affect enforceability.',
        message_es: 'La fecha es en el futuro. Esto es inusual y puede afectar la ejecutabilidad.',
      })
    }
  }

  // 3. Amount exceeds remaining contract value
  if (input.projectContractValue > 0) {
    const remaining = input.projectContractValue - input.totalPreviouslyBilled
    if (input.amount > remaining && remaining > 0) {
      errors.push({
        field: 'amount',
        message_en: `Amount ($${input.amount.toLocaleString()}) exceeds remaining contract balance ($${remaining.toLocaleString()}).`,
        message_es: `El monto ($${input.amount.toLocaleString()}) excede el balance restante del contrato ($${remaining.toLocaleString()}).`,
      })
    }
  }

  // 4. Notarization requirement
  if (compliance.requiresNotarization) {
    warnings.push({
      field: 'general',
      message_en: `This waiver must be notarized to be enforceable in ${stateRule?.stateName || input.state}. A notary block will be included in the PDF.`,
      message_es: `Este waiver debe ser notarizado para ser valido en ${stateRule?.stateName || input.state}. Se incluira un bloque notarial en el PDF.`,
    })
  }

  // 5. Unconditional waiver risk warning
  if (input.waiverType.startsWith('unconditional')) {
    warnings.push({
      field: 'waiverType',
      message_en: 'This is an unconditional waiver — it takes effect immediately upon signing, even if payment has not been received. Only sign if you have confirmed receipt of payment.',
      message_es: 'Este es un waiver incondicional — toma efecto inmediatamente al firmar, incluso si no se ha recibido el pago. Solo firma si has confirmado la recepcion del pago.',
    })
    // Extra warning for large amounts
    if (input.amount > 50000) {
      warnings.push({
        field: 'amount',
        message_en: `You are unconditionally waiving rights on $${input.amount.toLocaleString()}. Double-check that payment has been received and cleared.`,
        message_es: `Estas renunciando incondicionalmente a derechos por $${input.amount.toLocaleString()}. Verifica que el pago haya sido recibido y procesado.`,
      })
    }
  }

  // 6. Final payment with retention not accounted for
  if (input.isFinalPayment && input.hasRetention && input.retentionPercentage > 0) {
    const retentionAmount = input.projectContractValue * (input.retentionPercentage / 100)
    if (input.amount < retentionAmount) {
      warnings.push({
        field: 'amount',
        message_en: `This is a final waiver but the amount ($${input.amount.toLocaleString()}) is less than the estimated retention ($${retentionAmount.toLocaleString()}). Make sure retention is included or excluded in exceptions.`,
        message_es: `Este es un waiver final pero el monto ($${input.amount.toLocaleString()}) es menor que la retencion estimada ($${retentionAmount.toLocaleString()}). Asegurate de incluir o excluir la retencion en las excepciones.`,
      })
    }
  }

  // 7. Compliance status warning
  if (compliance.status === 'disclaimer_required') {
    warnings.push({
      field: 'general',
      message_en: `${stateRule?.stateName || input.state} requires statutory waiver forms. A compliance disclaimer will be included since we are using a general form. Have this reviewed by a licensed attorney.`,
      message_es: `${stateRule?.stateName || input.state} requiere formularios de waiver estatutarios. Se incluira un aviso de cumplimiento ya que estamos usando un formulario general. Hagalo revisar por un abogado licenciado.`,
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export async function validateWaiver(input: ValidationInput): Promise<ValidationResult> {
  // Run deterministic checks first (instant, no API cost)
  const preChecks = runDeterministicChecks(input)

  // If there are blocking errors, return immediately without calling AI
  if (!preChecks.isValid) {
    return preChecks
  }

  // Run AI validation for nuanced checks
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
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    const aiResult = JSON.parse(cleaned) as ValidationResult

    // Merge deterministic warnings with AI results (dedup by field+message)
    const seenKeys = new Set(
      aiResult.warnings.map(w => `${w.field}:${w.message_en}`)
    )
    const mergedWarnings = [
      ...aiResult.warnings,
      ...preChecks.warnings.filter(w => !seenKeys.has(`${w.field}:${w.message_en}`)),
    ]

    return {
      isValid: aiResult.isValid && preChecks.isValid,
      errors: [...preChecks.errors, ...aiResult.errors],
      warnings: mergedWarnings,
    }
  } catch {
    // Graceful fallback — return deterministic results if AI fails
    return {
      isValid: preChecks.isValid,
      errors: preChecks.errors,
      warnings: [
        ...preChecks.warnings,
        {
          field: 'general',
          message_en: 'AI validation is currently unavailable. Deterministic checks have been applied. Please review your waiver details carefully.',
          message_es: 'La validacion AI no esta disponible. Se aplicaron verificaciones automaticas. Por favor revisa los detalles de tu waiver cuidadosamente.',
        },
      ],
    }
  }
}
