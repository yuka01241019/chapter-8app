import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

export const useSupabaseSession = () => {
  //undefined: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
        //現在ログイン中かどうかのチェック
      } = await supabase.auth.getSession();
      console.log("getSession result", session);
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoading(false);
    };
    fetcher();
  }, []);

  return { session, isLoading, token };
};
