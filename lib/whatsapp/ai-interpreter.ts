// AI interpreter for WhatsApp bot — uses Claude Haiku to extract structured data
// from natural language messages while maintaining the funnel flow

import { anthropic } from '@/lib/ai/client'
import type { WhatsAppLead } from './conversation'
import type { ConversationMessage } from './conversation-history'
import {
  buildSystemPrompt,
  buildUserMessage,
  aiResponseSchema,
  type AIResponse,
} from './ai-prompts'
import { normalizeTrade, normalizeState, normalizeCompanySize } from './trade-normalizer'

const AI_MODEL = 'claude-3-5-haiku-20241022'
const AI_TIMEOUT_MS = 5_000
const CONFIDENCE_THRESHOLD = 0.7

export type AIExtractionResult = {
  extracted: {
    name?: string
    trade?: string
    location_state?: string
    company_size?: string
    intent?: AIResponse['extracted']['intent']
  }
  confidence: number
  conversationalReply?: string
}

const EMPTY_RESULT: AIExtractionResult = {
  extracted: {},
  confidence: 0,
}

/**
 * Interpret a user message using Claude Haiku.
 * Extracts structured data (name, trade, location, size, intent)
 * and optionally generates a conversational reply for Q&A.
 *
 * Returns EMPTY_RESULT on any failure (timeout, parse error, low confidence).
 * The caller should fall back to menu-based handling in that case.
 */
export async function interpretMessage(
  lead: WhatsAppLead,
  text: string,
  recentMessages: ConversationMessage[]
): Promise<AIExtractionResult> {
  try {
    const systemPrompt = buildSystemPrompt(lead)
    const userMessage = buildUserMessage(text, recentMessages)

    const response = await Promise.race([
      anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
      createTimeout(AI_TIMEOUT_MS),
    ])

    if (!response || !('content' in response)) {
      console.error('AI interpreter: timeout or empty response')
      return EMPTY_RESULT
    }

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      console.error('AI interpreter: no text block in response')
      return EMPTY_RESULT
    }

    return parseAndValidateResponse(textBlock.text)
  } catch (error) {
    console.error('AI interpreter error:', error instanceof Error ? error.message : error)
    return EMPTY_RESULT
  }
}

/**
 * Parse the raw AI response text, extract JSON, validate with Zod,
 * and normalize extracted fields.
 */
function parseAndValidateResponse(rawText: string): AIExtractionResult {
  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.error('AI interpreter: no JSON found in response')
    return EMPTY_RESULT
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    console.error('AI interpreter: JSON parse failed')
    return EMPTY_RESULT
  }

  const validated = aiResponseSchema.safeParse(parsed)
  if (!validated.success) {
    console.error('AI interpreter: Zod validation failed:', validated.error.message)
    return EMPTY_RESULT
  }

  const { extracted, confidence, conversationalReply } = validated.data

  // Below threshold — not confident enough to use
  if (confidence < CONFIDENCE_THRESHOLD) {
    return EMPTY_RESULT
  }

  // Normalize extracted fields
  const normalized: AIExtractionResult['extracted'] = {
    intent: extracted.intent,
  }

  if (extracted.name && extracted.name.length >= 2) {
    normalized.name = extracted.name
  }

  if (extracted.trade) {
    normalized.trade = normalizeTrade(extracted.trade) ?? extracted.trade
  }

  if (extracted.location_state) {
    const state = normalizeState(extracted.location_state)
    if (state) {
      normalized.location_state = state
    }
  }

  if (extracted.company_size) {
    normalized.company_size = normalizeCompanySize(extracted.company_size) ?? extracted.company_size
  }

  return {
    extracted: normalized,
    confidence,
    conversationalReply,
  }
}

/**
 * Create a timeout promise that resolves to null after the specified duration.
 */
function createTimeout(ms: number): Promise<null> {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms))
}
