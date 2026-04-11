import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for use in Server Components
// Uses the same anon key but runs on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key for elevated operations (server-only)
// WARNING: Never import this in client components or expose to the browser
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
