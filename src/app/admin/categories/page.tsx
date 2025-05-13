"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type Category = {
  id: number;
  name: string;
};
//カテゴリー一覧ページ
const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>();
  const { token } = useSupabaseSession();
  useEffect(() => {
    if (!token) return;
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("カテゴリー取得エラー", error);
      }
    };
    fetchCategories();
  }, [token]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-9 mt-2">
        <h1 className="text-lg font-bold mb-9 mt-2">カテゴリー一覧</h1>
        <Link
          href="/admin/categories/new"
          className="py-2 px-4 border  rounded-lg  text-white bg-blue-700"
        >
          新規作成
        </Link>
      </div>
      {/* カテゴリーが1件以上ある場合の表示 */}
      <div>
        {categories?.length ? (
          categories.map((category) => (
            //各カテゴリーを順に表示
            <Link href={`/admin/categories/${category.id}`}>
              <div key={category.id} className="border-b border-gray-300 py-4">
                <h2 className="font-black">{category.name}</h2>
              </div>
            </Link>
          ))
        ) : (
          //カテゴリーがない場合の表示
          <p>カテゴリーがありません。</p>
        )}
      </div>
    </div>
  );
};
export default AdminCategoriesPage;
