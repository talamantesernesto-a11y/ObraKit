// Fetch recent conversation messages for AI context
// Provides conversation history to the AI interpreter

import { createAdminClient } from '@/lib/supabase/admin'

export type ConversationMessage = {
  direction: 'inbound' | 'outbound'
  body: string
  created_at: string
}

/**
 * Fetch the most recent messages for a lead, ordered chronologically.
 * Used to provide conversation context to the AI interpreter.
 *
 * @param leadId - The lead's UUID
 * @param limit - Max messages to fetch (default 6, keeps token count low)
 * @returns Array of messages in chronological order (oldest first)
 */
export async function getRecentMessages(
  leadId: string,
  limit: number = 6
): Promise<ConversationMessage[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .select('direction, body, created_at')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch conversation history:', error.message)
    return []
  }

  if (!data || data.length === 0) return []

  // Reverse to chronological order (oldest first) for AI context
  return data.reverse() as ConversationMessage[]
}
