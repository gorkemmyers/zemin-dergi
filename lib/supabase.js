import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://daxlsxqghnooquiywzrb.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheGxzeHFnaG5vb3F1aXl3enJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NTc4MTEsImV4cCI6MjEwMzIzMzgxMX0.7hAgNWoCZvUy9bcaHePzNV-Hphe5TvC-fDYd-bZXNTo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
