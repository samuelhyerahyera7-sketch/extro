// Fill these in with your Supabase project's URL and anon key.
const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

const sb = window.DEMO_MODE ? window.DEMO_SB : supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
