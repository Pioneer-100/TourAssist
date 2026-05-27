import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("--- 🛰️ [TourAssist Supabase Initialization] ---");
console.log("Supabase URL defined:", !!supabaseUrl, supabaseUrl ? `(${supabaseUrl})` : "(undefined/empty)");
console.log("Supabase Key defined:", !!supabaseKey, supabaseKey ? `(length: ${supabaseKey.length})` : "(undefined/empty)");

export const supabase = createClient(supabaseUrl, supabaseKey)