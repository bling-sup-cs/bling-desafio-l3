import { createClient } from '@supabase/supabase-js'

// Substitua pelos valores do seu projeto Supabase no Lovable
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function saveSubmission(data) {
  const { error } = await supabase.from('submissions').insert([data])
  if (error) throw error
}

export async function getSubmissions() {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
