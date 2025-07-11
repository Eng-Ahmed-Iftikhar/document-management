import { createClient } from '@supabase/supabase-js';
import env from './env';

// Supabase client
const supabaseClient = createClient(env.supabase.url, env.supabase.key);

export default supabaseClient;
