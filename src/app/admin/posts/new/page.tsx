"use client";

import { CreatePost } from "@/app/_types/Post";
import { PostForm } from "../_components/PostForm";
import { useState } from "react";

// 管理者_記事の新規作成リクエスト。データをバックエンドのAPIに送信するための関数。役割→「投稿すること」だけ
export const createPost = async (postData: CreatePost) => {
  try {
    const { title, content, thumbnailUrl, categories } = postData; //必要なプロパティだけ取り出す
    const res = await fetch("/api/admin/posts", {
      // 第2引数はHTTPリクエストを送信するための関数
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, thumbnailUrl, categories }), //必要なデータだけ送る
    });
    if (!res.ok) {
      throw new Error("投稿に失敗しました");
    } //リクエストが失敗した場合
    const data: CreatePost = await res.json(); //レスポンスの JSON を JavaScript オブジェクトに変換
    return data; //作成されたデータを返す
  } catch (error) {
    console.error("投稿エラー", error); //エラー内容をコンソールに出力
  }
};

// // NewPostPage関数でPostFormコンポーネントだけを返す
const NewPostPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit=async(data:CreatePost)=>{
  setIsSubmitting(true);
  try{
  await createPost(data);
  alert("投稿に成功しました");
  }finally{
  setIsSubmitting(false);}
  }
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-9 mt-2">記事作成</h1>
      <PostForm
        submitLabel="作成"
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default NewPostPage;
