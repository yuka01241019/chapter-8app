import { createClient } from '@supabase/supabase-js'
//Supabaseクライアント（サーバー用）を作成
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)