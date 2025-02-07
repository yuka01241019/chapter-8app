"use client";//クライアントサイドで実行

import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="bg-zinc-700 font-bold text-white py-7 px-5">
      <Link href="/" className="">
        Blog
      </Link>
      <Link href="/contact" className="float-right">
        お問い合わせ
      </Link>
    </header>
  );
};
