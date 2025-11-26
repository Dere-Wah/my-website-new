import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Types for our database schema
export interface EmailSubscription {
  id: string;
  subscribed_at: string;
  email: string;
  unsubscribed_at: string | null;
  last_sent: string | null;
}
