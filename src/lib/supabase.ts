import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// types for Supabase auth - using the actual Supabase User type
export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  created_at: string;
  updated_at?: string;
};

export interface AuthSession {
  user: SupabaseUser;
  access_token: string;
  refresh_token: string;
}
