"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};
//カテゴリー一覧ページ
const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("カテゴリー取得エラー", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-9 mt-2">
        <h1 className="text-lg font-bold mb-9 mt-2">カテゴリー一覧</h1>
        <Link
          href="/api/admin/categories/new"
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
            <div key={category.id} className="border-b border-gray-300 py-4">
              <h2 className="font-black">{category.name}</h2>
            </div>
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
