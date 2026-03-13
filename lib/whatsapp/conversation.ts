import { createAdminClient } from '@/lib/supabase/admin'
import { MESSAGES, TRADE_OPTIONS, SIZE_OPTIONS } from './messages'

export type FunnelStage =
  | 'new'
  | 'greeting'
  | 'qualifying_name'
  | 'qualifying_trade'
  | 'qualifying_location'
  | 'qualifying_size'
  | 'qualified'
  | 'sales_handoff'
  | 'not_interested'

export type WhatsAppLead = {
  id: string
  phone: string
  name: string | null
  company_name: string | null
  trade: string | null
  location_state: string | null
  company_size: string | null
  funnel_stage: FunnelStage
  qualified_at: string | null
  last_message_at: string | null
  created_at: string
  updated_at: string
}

export type HandleResult = {
  reply: string
  updates: Partial<WhatsAppLead>
}

const supabase = createAdminClient()

/**
 * Get or create a lead by phone number.
 * Uses upsert with ignoreDuplicates to avoid overwriting existing leads.
 */
export async function getOrCreateLead(phone: string): Promise<WhatsAppLead> {
  // Try to find existing lead first
  const { data: existing } = await supabase
    .from('whatsapp_leads')
    .select('*')
    .eq('phone', phone)
    .single()

  if (existing) return existing as WhatsAppLead

  // Create new lead
  const { data: created, error } = await supabase
    .from('whatsapp_leads')
    .insert({ phone, funnel_stage: 'new' })
    .select()
    .single()

  if (error) throw new Error(`Failed to create lead: ${error.message}`)
  return created as WhatsAppLead
}

/**
 * Core state machine: given a lead and their message, return the reply and DB updates.
 */
export function handleMessage(lead: WhatsAppLead, text: string): HandleResult {
  const input = text.trim().toLowerCase()
  const isGreeting = /^(hola|hi|hello|hey|buenos?\s*d[ií]as?|buenas?\s*tardes?|buenas?\s*noches?)$/i.test(input)

  // Allow restart from terminal states — clear qualifying data for fresh start
  if (isGreeting && (lead.funnel_stage === 'sales_handoff' || lead.funnel_stage === 'not_interested')) {
    return {
      reply: MESSAGES.greeting,
      updates: {
        funnel_stage: 'greeting',
        name: null,
        trade: null,
        location_state: null,
        company_size: null,
        qualified_at: null,
      },
    }
  }

  // Check for opt-out at any qualifying stage
  if ((input === 'no' || input === 'no gracias' || input === 'cancelar') &&
      lead.funnel_stage.startsWith('qualifying_')) {
    return {
      reply: MESSAGES.notInterested,
      updates: { funnel_stage: 'not_interested' },
    }
  }

  switch (lead.funnel_stage) {
    case 'new': {
      return {
        reply: MESSAGES.greeting,
        updates: { funnel_stage: 'greeting' },
      }
    }

    case 'greeting': {
      if (input === '1' || input === '3') {
        return {
          reply: MESSAGES.askName,
          updates: { funnel_stage: 'qualifying_name' },
        }
      }
      if (input === '2') {
        return {
          reply: MESSAGES.support,
          updates: {}, // stay in greeting
        }
      }
      // If they greet again or send unrecognized input, re-show menu
      return {
        reply: MESSAGES.greeting,
        updates: {},
      }
    }

    case 'qualifying_name': {
      const name = text.trim()
      if (name.length < 2) {
        return {
          reply: '¿Podrías escribir tu nombre completo?',
          updates: {},
        }
      }
      return {
        reply: MESSAGES.askTrade.replace('{{name}}', name),
        updates: { name, funnel_stage: 'qualifying_trade' },
      }
    }

    case 'qualifying_trade': {
      const trade = TRADE_OPTIONS[input] || text.trim()
      return {
        reply: MESSAGES.askLocation,
        updates: { trade, funnel_stage: 'qualifying_location' },
      }
    }

    case 'qualifying_location': {
      const location = text.trim()
      if (location.length < 2) {
        return {
          reply: 'Por favor escribe el estado donde trabajas (ejemplo: Texas, California)',
          updates: {},
        }
      }
      return {
        reply: MESSAGES.askSize,
        updates: { location_state: location, funnel_stage: 'qualifying_size' },
      }
    }

    case 'qualifying_size': {
      const size = SIZE_OPTIONS[input] || text.trim()
      return {
        reply: MESSAGES.qualified.replace('{{name}}', lead.name || ''),
        updates: {
          company_size: size,
          funnel_stage: 'qualified',
          qualified_at: new Date().toISOString(),
        },
      }
    }

    case 'qualified': {
      return {
        reply: MESSAGES.salesHandoff,
        updates: { funnel_stage: 'sales_handoff' },
      }
    }

    case 'sales_handoff': {
      if (input === 'soporte' || input === '2') {
        return { reply: MESSAGES.support, updates: {} }
      }
      return { reply: MESSAGES.salesHandoff, updates: {} }
    }

    case 'not_interested': {
      return { reply: MESSAGES.notInterested, updates: {} }
    }

    default: {
      return { reply: MESSAGES.fallback, updates: {} }
    }
  }
}

/**
 * Update lead fields in the database.
 */
export async function updateLead(leadId: string, updates: Partial<WhatsAppLead>) {
  if (Object.keys(updates).length === 0) return

  const { error } = await supabase
    .from('whatsapp_leads')
    .update({ ...updates, last_message_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) console.error('Failed to update lead:', error.message)
}

/**
 * Log a message (inbound or outbound) for conversation history.
 */
export async function logMessage(
  leadId: string,
  direction: 'inbound' | 'outbound',
  body: string,
  waMessageId?: string
) {
  const { error } = await supabase
    .from('whatsapp_messages')
    .insert({
      lead_id: leadId,
      direction,
      body,
      wa_message_id: waMessageId ?? null,
    })

  if (error) {
    // If it's a duplicate wa_message_id, that's expected (webhook retry)
    if (error.code === '23505') return 'duplicate'
    console.error('Failed to log message:', error.message)
  }

  return 'ok'
}
