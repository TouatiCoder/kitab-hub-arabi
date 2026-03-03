import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// قراءة متغيرات البيئة من ملف .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود القيم قبل إنشاء العميل لتجنب أخطاء Fetch
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);