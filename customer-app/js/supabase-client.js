const SUPABASE_URL = 'https://xqncxxcxcjqcsjoopafr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbmN4eGN4Y2pxY3Nqb29wYWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzM3ODAsImV4cCI6MjA5NzU0OTc4MH0.90-sra0GYT_cO5eodRw5nMxKTpYx0l7VEMpxdAG9ZNc';

const sb = window.DEMO_MODE ? window.DEMO_SB : supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
