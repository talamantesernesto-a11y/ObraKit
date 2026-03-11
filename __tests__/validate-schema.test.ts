import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Mirror the schema from app/api/waivers/validate/route.ts
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

describe('Waiver Validate Schema', () => {
  const validInput = {
    waiverType: 'conditional_progress',
    state: 'California',
    amount: 12500,
    throughDate: '2026-03-15',
    projectContractValue: 100000,
    totalPreviouslyBilled: 50000,
    isFinalPayment: false,
    hasRetention: true,
    retentionPercentage: 10,
  }

  it('accepts valid input', () => {
    const result = validateSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('rejects empty waiverType', () => {
    const result = validateSchema.safeParse({ ...validInput, waiverType: '' })
    expect(result.success).toBe(false)
  })

  it('rejects negative amount', () => {
    const result = validateSchema.safeParse({ ...validInput, amount: -100 })
    expect(result.success).toBe(false)
  })

  it('rejects amount over 100 million', () => {
    const result = validateSchema.safeParse({ ...validInput, amount: 200_000_000 })
    expect(result.success).toBe(false)
  })

  it('rejects state shorter than 2 chars', () => {
    const result = validateSchema.safeParse({ ...validInput, state: 'X' })
    expect(result.success).toBe(false)
  })

  it('rejects retention over 100%', () => {
    const result = validateSchema.safeParse({ ...validInput, retentionPercentage: 150 })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const result = validateSchema.safeParse({ waiverType: 'test' })
    expect(result.success).toBe(false)
  })

  it('rejects non-boolean isFinalPayment', () => {
    const result = validateSchema.safeParse({ ...validInput, isFinalPayment: 'yes' })
    expect(result.success).toBe(false)
  })

  it('rejects string amount (type coercion attack)', () => {
    const result = validateSchema.safeParse({ ...validInput, amount: '12500; DROP TABLE waivers' })
    expect(result.success).toBe(false)
  })

  it('accepts zero amount', () => {
    const result = validateSchema.safeParse({ ...validInput, amount: 0 })
    expect(result.success).toBe(true)
  })

  it('accepts zero retention', () => {
    const result = validateSchema.safeParse({ ...validInput, retentionPercentage: 0 })
    expect(result.success).toBe(true)
  })
})
