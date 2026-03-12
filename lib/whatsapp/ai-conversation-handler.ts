// Hybrid conversation handler — orchestrates AI interpretation + state machine fallback
// This is the main entry point for processing WhatsApp messages

import { type WhatsAppLead, type FunnelStage, handleMessage } from './conversation'
import { MESSAGES } from './messages'
import { interpretMessage, type AIExtractionResult } from './ai-interpreter'
import type { ConversationMessage } from './conversation-history'

type HybridResult = {
  reply: string
  updates: Partial<WhatsAppLead>
}

// Stages that require specific qualifying fields
const QUALIFYING_FIELDS: Record<string, keyof Pick<WhatsAppLead, 'name' | 'trade' | 'location_state' | 'company_size'>> = {
  qualifying_name: 'name',
  qualifying_trade: 'trade',
  qualifying_location: 'location_state',
  qualifying_size: 'company_size',
}

// Ordered list of qualifying stages for skip logic
const QUALIFYING_STAGES: FunnelStage[] = [
  'qualifying_name',
  'qualifying_trade',
  'qualifying_location',
  'qualifying_size',
]

/**
 * Hybrid message handler: tries AI interpretation first, falls back to menu-based state machine.
 *
 * Decision tree:
 * 1. Simple menu input ("1"-"8") → direct to handleMessage (no AI cost)
 * 2. Qualifying stages → AI extracts data, skips stages if possible
 * 3. Post-qualification → AI answers questions about ObraKit
 * 4. Any failure → fallback to handleMessage menus
 */
export async function handleMessageHybrid(
  lead: WhatsAppLead,
  text: string,
  recentMessages: ConversationMessage[]
): Promise<HybridResult> {
  const input = text.trim()

  // 1. Simple menu inputs — skip AI entirely ($0 cost)
  if (isMenuInput(input)) {
    return handleMessage(lead, text)
  }

  // 2. Check for explicit opt-out (no AI needed)
  const lowerInput = input.toLowerCase()
  if (isOptOut(lowerInput) && lead.funnel_stage.startsWith('qualifying_')) {
    return handleMessage(lead, text)
  }

  // 3. Check for greeting (no AI needed for restart)
  const isGreeting = /^(hola|hi|hello|hey|buenos?\s*d[ií]as?|buenas?\s*tardes?|buenas?\s*noches?)$/i.test(lowerInput)
  if (isGreeting && (lead.funnel_stage === 'new' || lead.funnel_stage === 'sales_handoff' || lead.funnel_stage === 'not_interested')) {
    return handleMessage(lead, text)
  }

  // 4. AI-powered handling
  try {
    console.log(`Hybrid handler: calling AI for stage=${lead.funnel_stage}`)
    const aiResult = await interpretMessage(lead, text, recentMessages)

    // If AI returned nothing useful, fall back to menu
    if (aiResult.confidence === 0) {
      console.log('Hybrid handler: AI returned confidence=0, falling back to menu')
      return handleMessage(lead, text)
    }

    console.log(`Hybrid handler: AI confidence=${aiResult.confidence}, routing for stage=${lead.funnel_stage}`)

    // Route based on funnel stage
    if (isQualifyingStage(lead.funnel_stage)) {
      return handleQualifyingWithAI(lead, aiResult)
    }

    if (lead.funnel_stage === 'greeting') {
      return handleGreetingWithAI(lead, text, aiResult)
    }

    if (lead.funnel_stage === 'qualified' || lead.funnel_stage === 'sales_handoff') {
      return handlePostQualificationWithAI(lead, aiResult)
    }

    // Default fallback
    return handleMessage(lead, text)
  } catch (error) {
    console.error('Hybrid handler error, falling back to menu:', error)
    return handleMessage(lead, text)
  }
}

// ─── Qualifying Stage Handler ───────────────────────────────────────────────

function handleQualifyingWithAI(
  lead: WhatsAppLead,
  aiResult: AIExtractionResult
): HybridResult {
  const { extracted } = aiResult
  const updates: Partial<WhatsAppLead> = {}

  // Collect all extractable fields
  if (extracted.name && !lead.name) updates.name = extracted.name
  if (extracted.trade && !lead.trade) updates.trade = extracted.trade
  if (extracted.location_state && !lead.location_state) updates.location_state = extracted.location_state
  if (extracted.company_size && !lead.company_size) updates.company_size = extracted.company_size

  // No new data extracted — fall back to the current stage's menu prompt
  if (Object.keys(updates).length === 0) {
    return buildStagePrompt(lead)
  }

  // Determine the furthest reachable stage
  const currentStageIndex = QUALIFYING_STAGES.indexOf(lead.funnel_stage as FunnelStage)
  let nextStageIndex = currentStageIndex

  for (let i = currentStageIndex; i < QUALIFYING_STAGES.length; i++) {
    const field = QUALIFYING_FIELDS[QUALIFYING_STAGES[i]]
    const hasField = updates[field] || lead[field]
    if (hasField) {
      nextStageIndex = i + 1
    } else {
      break
    }
  }

  // All fields filled — qualify the lead!
  if (nextStageIndex >= QUALIFYING_STAGES.length) {
    const name = updates.name || lead.name || ''
    const trade = updates.trade || lead.trade || ''
    const location = updates.location_state || lead.location_state || ''
    const size = updates.company_size || lead.company_size || ''

    return {
      reply: buildConfirmationMessage(name, trade, location, size),
      updates: {
        ...updates,
        funnel_stage: 'qualified',
        qualified_at: new Date().toISOString(),
      },
    }
  }

  // Partial extraction — advance to next missing stage
  const nextStage = QUALIFYING_STAGES[nextStageIndex]
  return {
    reply: buildPartialConfirmation(lead, updates, nextStage),
    updates: {
      ...updates,
      funnel_stage: nextStage,
    },
  }
}

// ─── Greeting Stage Handler ─────────────────────────────────────────────────

function handleGreetingWithAI(
  lead: WhatsAppLead,
  text: string,
  aiResult: AIExtractionResult
): HybridResult {
  const { extracted } = aiResult

  // If intent is clear support, route there
  if (extracted.intent === 'support') {
    return { reply: MESSAGES.support, updates: {} }
  }

  // If intent is opt-out, show not interested message
  if (extracted.intent === 'opt_out') {
    return { reply: MESSAGES.notInterested, updates: { funnel_stage: 'not_interested' } }
  }

  // If AI extracted qualifying data (name, trade, location, size), use it
  // regardless of intent — the user is providing info, so qualify them
  const hasQualifyingData = extracted.name || extracted.trade || extracted.location_state || extracted.company_size
  if (hasQualifyingData) {
    const syntheticLead: WhatsAppLead = {
      ...lead,
      funnel_stage: 'qualifying_name',
    }
    return handleQualifyingWithAI(syntheticLead, aiResult)
  }

  // Intent detected but no data — advance to qualifying
  if (extracted.intent === 'learn_more' || extracted.intent === 'talk_to_advisor') {
    return {
      reply: MESSAGES.askName,
      updates: { funnel_stage: 'qualifying_name' },
    }
  }

  // Intent unclear and no data — fall back to menu
  return handleMessage(lead, text)
}

// ─── Post-Qualification Handler ─────────────────────────────────────────────

function handlePostQualificationWithAI(
  lead: WhatsAppLead,
  aiResult: AIExtractionResult
): HybridResult {
  const { extracted, conversationalReply } = aiResult

  if (extracted.intent === 'support') {
    return { reply: MESSAGES.support, updates: {} }
  }

  // Only advance to sales_handoff on explicit advisor intent
  const shouldAdvance = lead.funnel_stage === 'qualified' &&
    extracted.intent === 'talk_to_advisor'

  // If AI generated a conversational reply, use it
  if (conversationalReply && conversationalReply.length > 0) {
    return {
      reply: conversationalReply,
      updates: shouldAdvance ? { funnel_stage: 'sales_handoff' } : {},
    }
  }

  return {
    reply: shouldAdvance ? MESSAGES.salesHandoff : MESSAGES.qualified.replace('{{name}}', lead.name || ''),
    updates: shouldAdvance ? { funnel_stage: 'sales_handoff' } : {},
  }
}

// ─── Helper Functions ───────────────────────────────────────────────────────

function isMenuInput(input: string): boolean {
  return /^[1-8]$/.test(input.trim())
}

function isOptOut(input: string): boolean {
  return ['no', 'no gracias', 'cancelar'].includes(input)
}

function isQualifyingStage(stage: FunnelStage): boolean {
  return stage.startsWith('qualifying_')
}

function buildConfirmationMessage(
  name: string,
  trade: string,
  location: string,
  size: string
): string {
  return `¡Gracias, ${name}! 🎉 Ya tenemos tu información:\n\n` +
    `🔧 Oficio: ${trade}\n` +
    `📍 Estado: ${location}\n` +
    `👥 Empresa: ${size} empleados\n\n` +
    `Un asesor de ObraKit te contactará pronto. Mientras tanto, conoce más en obrakit.ai 🏗️`
}

function buildPartialConfirmation(
  lead: WhatsAppLead,
  updates: Partial<WhatsAppLead>,
  nextStage: FunnelStage
): string {
  const confirmed: string[] = []
  if (updates.name) confirmed.push(`✅ Nombre: ${updates.name}`)
  if (updates.trade) confirmed.push(`✅ Oficio: ${updates.trade}`)
  if (updates.location_state) confirmed.push(`✅ Estado: ${updates.location_state}`)
  if (updates.company_size) confirmed.push(`✅ Empresa: ${updates.company_size}`)

  const nextPrompts: Record<string, string> = {
    qualifying_name: '¿Cuál es tu nombre?',
    qualifying_trade: '¿Qué tipo de trabajo haces? (plomería, eléctrico, concreto, pintura, drywall, roofing, HVAC, otro)',
    qualifying_location: '¿En qué estado de EE.UU. trabajas?',
    qualifying_size: '¿Cuántos empleados tiene tu empresa? (1-5, 6-15, 16-50, 50+)',
  }

  const confirmation = confirmed.length > 0
    ? `¡Perfecto! ${confirmed.join('\n')}\n\n`
    : ''

  return `${confirmation}${nextPrompts[nextStage] || MESSAGES.fallback}`
}

function buildStagePrompt(lead: WhatsAppLead): HybridResult {
  const prompts: Partial<Record<FunnelStage, string>> = {
    qualifying_name: MESSAGES.askName,
    qualifying_trade: MESSAGES.askTrade.replace('{{name}}', lead.name || ''),
    qualifying_location: MESSAGES.askLocation,
    qualifying_size: MESSAGES.askSize,
  }

  return {
    reply: prompts[lead.funnel_stage] || MESSAGES.fallback,
    updates: {},
  }
}
