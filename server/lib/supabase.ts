import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qpwdvjlbsilwqrznsqlq.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwd2R2amxic2lsd3Fyem5zcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDA2NDEsImV4cCI6MjA2ODM3NjY0MX0.fgyzHnL6kICr4eP4CGLuSAaHgy8R4KtqN5yMLDXiq7E'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and key are required')
}

export const supabase = createClient(supabaseUrl, supabaseKey)