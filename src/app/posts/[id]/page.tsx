"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; //next/navigationからuseParamsをインポートする
import { ArticlesCardDetail } from "./_components/ArticlesCardDetail";
import { Post } from "..//../_types/Post";
import Image from "next/image"; //Imageコンポーネントをインポート
import { supabase } from "@/utils/supabase";

const PageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); //useRouterを使用してURLパラメータを取得する
  const [post, setPost] = useState<Post | null>(null); //postの状態管理
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>(""); //画像URLを保持
  const [isLoading, setIsLoading] = useState<boolean>(true); //ローディング状態

  useEffect(() => {
    const fetchPageDetail = async () => {
      setIsLoading(true); //ローディング開始
      try {
        const res = await fetch(`/api/posts/${id}`); //APIから記事データを取得
        const data = await res.json();
        console.log("確認", data);
        setPost(data.post); //取得したデータをセット
      } catch (error) {
        console.error("記事取得エラー", error);
      } finally {
        setIsLoading(false); //ローディング終了
      }
    };
    fetchPageDetail();
  }, [id]); //IDが変わるたびに再実行
  
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]); //画像キーが変わったら実行
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
        {thumbnailImageUrl && (
          <Image //<img>タグをnext/imageのImageコンポーネントに置き換え修正
            alt={post.title}
            className="mt-12"
            src={thumbnailImageUrl}
            height={400}
            width={800}
          />
        )}
      </div>
      <ArticlesCardDetail post={post} className="border-none" />
    </div>
  );
};
export default PageDetail;
