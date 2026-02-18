import { createClient } from '@supabase/supabase-js'

// 1. Force TypeScript to recognize the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 2. Export the single instance of the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)