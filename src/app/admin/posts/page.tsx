"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  createdAt: string;
  postCategories: {
    category: Category;
  }[];
};

//記事一覧ページ
const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); //初期値は空配列に
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("記事取得エラー", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-9 mt-2">
        <h1 className="text-lg font-bold mb-9 mt-2">記事一覧</h1>

        <Link
          href="/admin/posts/new"
          className="py-2 px-4 border  rounded-lg  text-white bg-blue-700"
        >
          新規作成
        </Link>
      </div>
      <div>
        {/* 記事が1件以上ある場合の表示 */}
        {posts.length ? (
          posts.map((post) => (
            //各記事を順に表示
            <div key={post.id} className="border-b border-gray-300 py-4">
              <Link href={`/admin/posts/${post.id}`}>
                <h2 className="font-black">{post.title}</h2>
              </Link>
              <p className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          //記事がない場合の表示
          <p>記事がありません。</p>
        )}
      </div>
    </div>
  );
};

export default AdminPostsPage;
