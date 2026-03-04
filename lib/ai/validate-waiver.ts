import { anthropic } from './client'

export type ValidationResult = {
  isValid: boolean
  errors: { field: string; message_en: string; message_es: string }[]
  warnings: { field: string; message_en: string; message_es: string }[]
}

export async function validateWaiver(input: {
  waiverType: string
  state: string
  amount: number
  throughDate: string
  projectContractValue: number
  totalPreviouslyBilled: number
  isFinalPayment: boolean
  hasRetention: boolean
  retentionPercentage: number
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
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned) as ValidationResult
  } catch {
    // Graceful fallback — never block the wizard
    return {
      isValid: true,
      errors: [],
      warnings: [{
        field: 'general',
        message_en: 'AI validation is currently unavailable. Please review your waiver details carefully.',
        message_es: 'La validación AI no está disponible en este momento. Por favor revisa los detalles de tu renuncia cuidadosamente.',
      }],
    }
  }
}
