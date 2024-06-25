import { createClient } from '@supabase/supabase-js';
const URL = process.env.REACT_APP_SUPABASE_URL;
const KEY = process.env.REACT_APP_SUPABASE_API_KEY;
const supabase = createClient(URL, KEY);

export default supabase;
