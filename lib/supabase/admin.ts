import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabaseAdmin: ReturnType<typeof createClient> | null = null

if (
  supabaseUrl &&
  serviceRoleKey &&
  supabaseUrl !== 'your-supabase-url' &&
  serviceRoleKey !== 'your-service-role-key'
) {
  supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
} else if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-console
  console.error('Supabase admin client is not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
}

export { supabaseAdmin }
