"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSideBar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); //現在のパスを取得
  //children=「このレイアウト内に表示したいページの中身」
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-100 ">
        <ul className="space-y-0">
          <li>
            <Link
              href="/admin/posts"
              className={`block w-full py-4 px-4 ${
                pathname === "/admin/posts" ? "bg-blue-100" : ""
              }`}
            >
              記事一覧
            </Link>
          </li>
          <li>
            <Link
              href="/admin/categories"
              className={`block w-full py-4 px-4 ${
                pathname === "/admin/categories" ? "bg-blue-100" : ""
              }`}
            >
              カテゴリー一覧
            </Link>{" "}
          </li>
        </ul>
      </aside>
      {/* メイン表示エリア */}
      <main className="flex-1 bg-white p-8">{children}</main>
    </div>
  );
};

export default AdminSideBar;
