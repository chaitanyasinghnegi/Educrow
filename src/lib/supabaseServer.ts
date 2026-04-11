import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for use in Server Components
// Uses the same anon key but runs on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
