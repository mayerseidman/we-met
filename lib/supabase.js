// ══════════════════════════════════════════════════════════════
// lib/supabase.js
// ══════════════════════════════════════════════════════════════
// Creates and exports the Supabase client instance.
//
// WHY THIS EXISTS:
// The Supabase client needs to be created once and reused
// everywhere. Importing from this file ensures we always use
// the same instance rather than creating multiple connections.
//
// The URL and key come from .env.local (never hardcode these).
// NEXT_PUBLIC_ prefix means they're safe to use in the browser.
//
// RULE: Import { supabase } from this file whenever you need
// to talk to the database or auth system.
// ══════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storageKey: 'we-met-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
})