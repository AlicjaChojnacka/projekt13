import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://qrqfvpynzmmromkvtpon.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycWZ2cHluem1tcm9ta3Z0cG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTk3MTQsImV4cCI6MjA2MzIzNTcxNH0.CiGpqOg-PUBZkO3wJN7M7orgsCDRSYb5_EVW7NuS1ZI');

export { supabase }