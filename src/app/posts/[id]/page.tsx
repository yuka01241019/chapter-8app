"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; //next/navigationからuseParamsをインポートする
import { ArticlesCardDetail } from "./_components/ArticlesCardDetail";
import { MicroCmsPost } from "..//../_types/Post";
import Image from "next/image"; //Imageコンポーネントをインポート

const PageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); //useRouterを使用してURLパラメータを取得する
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchPageDetail = async () => {
      setIsLoading(true);
      const res = await fetch(
        `https://t0ga7qjyqq.microcms.io/api/v1/posts/${id}`,
        {
          headers: {
            "X-MICROCMS-API-KEY": process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setPost(data);
      setIsLoading(false);
    };
    fetchPageDetail();
  }, [id]);
  //ローディング中の処理
  if (isLoading) {
    return <div>読み込み中…</div>;
  }
  // postが見つからなかった場合の処理
  if (!post) {
    return <div>記事はありません</div>;
  }
  return (
    <div>
      <div className="flex items-center justify-center">
        <Image //<img>タグをnext/imageのImageコンポーネントに置き換え修正
          alt={post.title}
          className="mt-12"
          src={post.thumbnail.url}
          height={post.thumbnail.height} //高さを設定
          width={post.thumbnail.width} //幅を設定
        />
      </div>
      <ArticlesCardDetail post={post} className="border-none" />
    </div>
  );
};
export default PageDetail;
