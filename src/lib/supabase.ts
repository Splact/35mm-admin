import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabasePublicKey);

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
