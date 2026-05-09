const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized for backend');
} else {
  console.warn('Supabase credentials missing in backend .env. Using mock client.');
  const mockResponse = { data: [], error: null };
  const mockBuilder = {
    select: () => mockBuilder,
    order: () => mockBuilder,
    eq: () => mockBuilder,
    insert: () => mockBuilder,
    update: () => mockBuilder,
    single: () => mockBuilder,
    then: (resolve) => resolve(mockResponse),
    catch: (reject) => reject(new Error('Supabase not configured'))
  };

  supabase = {
    from: () => mockBuilder
  };
}

module.exports = { supabase };
