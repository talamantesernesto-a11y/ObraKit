'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseSignatureChannelReturn {
  channelId: string
  signatureData: string | null
  isConnected: boolean
  reset: () => void
}

function generateId(): string {
  return crypto.randomUUID()
}

export function useSignatureChannel(): UseSignatureChannelReturn {
  const [channelId] = useState(generateId)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const reset = useCallback(() => {
    setSignatureData(null)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`sign:${channelId}`)

    channel
      .on('broadcast', { event: 'signature-submitted' }, (payload) => {
        const data = payload.payload?.signatureDataUrl
        if (typeof data === 'string' && data.startsWith('data:image/png')) {
          setSignatureData(data)
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId])

  return { channelId, signatureData, isConnected, reset }
}
