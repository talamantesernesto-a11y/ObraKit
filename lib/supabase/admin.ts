import { createClient } from '@supabase/supabase-js'

// Admin client using SERVICE_ROLE_KEY — bypasses RLS.
// Only use in server-side API routes, never expose to the client.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
