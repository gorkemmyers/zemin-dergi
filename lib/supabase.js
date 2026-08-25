import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://daxlsxqghnooquiywzrb.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheGxzeHFnaG5vb3F1aXl3enJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NTc4MTEsImV4cCI6MjEwMzIzMzgxMX0.7hAgNWoCZvUy9bcaHePzNV-Hphe5TvC-fDYd-bZXNTo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
