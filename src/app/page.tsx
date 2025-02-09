"use client"; //クライアントサイドで実行

import { useEffect, useState } from "react";
import { ArticlesCard } from "./_components/ArticlesCard";
import { MicroCmsPost } from "./_types/Post";

// type ApiResponse = {
//   message: string;
//   posts: MicroCmsPost[];
// };

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]); // postsの型を指定
  const [isLoading, setIsLoading] = useState<boolean>(true); // isLoadingの型を指定
  // API呼び出しを行う関数
  useEffect(() => {
    const getApi = async () => {
      const res = await fetch("https://t0ga7qjyqq.microcms.io/api/v1/posts", {
        headers: {
          "X-MICROCMS-API-KEY": process.env
            .NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      const { contents } = await res.json();
      console.log(contents);
      setPosts(contents);
      setIsLoading(false);
    };
    getApi();
  }, []);
  //ローディング中
  if (isLoading) {
    return <div>読み込み中…</div>;
  }
  // 記事一覧データのAPIデータがない場合
  if (posts.length === 0) {
    return <div>記事一覧はありません</div>;
  }
  return (
    <div>
      {posts.map((post) => (
        <ArticlesCard key={post.id} post={post} /> // 投稿データをArticlesCardに渡す
      ))}
    </div>
  );
};
export default Posts;
