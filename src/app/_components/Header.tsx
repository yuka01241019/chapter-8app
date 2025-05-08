"use client"; //クライアントサイドで実行

import Link from "next/link";
import { useSupabaseSession } from "../hooks/useSupabaseSession";
import { supabase } from "../utils/supabase";

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="bg-gray-800 text-white p-6 font-bold flex justify-between items-center">
      <Link href="/" className="">
        Blog
      </Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin" className="">
                お問い合わせ
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="">
                お問い合わせ
              </Link>
              <Link href="/login" className="">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
