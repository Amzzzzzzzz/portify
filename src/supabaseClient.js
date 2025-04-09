import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tdqcgdjwacanmpudzejk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkcWNnZGp3YWNhbm1wdWR6ZWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDM2MDIsImV4cCI6MjA1OTYxOTYwMn0.q1KKnLVFZgD8IuYsN0Et-cNclzML1c_g89DlGFocxGI'; // get from Supabase > Project > Settings > API

export const supabase = createClient(supabaseUrl, supabaseKey);
