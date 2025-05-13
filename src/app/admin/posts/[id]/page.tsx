"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostForm } from "../_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type Category = {
  id: number;
  name: string;
};

type Post = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  postCategories: {
    category: Category;
  }[];
};

//記事編集(更新、削除)ページ
const EditPostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<{
    title: string;
    content: string;
    thumbnailImageKey: string;
    selectedCategoryId: number[];
  }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();
  // const [title, setTitle] = useState<string>(""); //titleを管理
  // const [content, setContent] = useState<string>(""); //本文を管理
  // const [thumbnailUrl, setThumbnailUrl] = useState(""); //サムネイルを管理
  // const [selectedCategories, setSelectedCategories] = useState<number[]>([]); //カテゴリーIDだけを保持
  // const [allCategories, setAllCategories] = useState<Category[]>([]); //カテゴリー一覧全部の情報を保持する役割（UI上にボタン表示するための用途）

  useEffect(() => {
    if (!token) return;
    const fetchPost = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          // "Content-Type": "application/json", 「POST」や「PUT」メソッドではない時は不要！＝メソッドを指定していない場合は「GET」→いらない
          Authorization: `Bearer${token}`, //このトークンを持っている人は認証済みとみなす
        },
      });
      const data = await res.json();
      const post: Post = data.post;

      setInitialData({
        title: post.title,
        content: post.content,
        thumbnailImageKey: post.thumbnailImageKey,
        selectedCategoryId: post.postCategories.map((pc) => pc.category.id),
      });
    };

    if (id) {
      fetchPost();
    }
  }, [id,token]); //tokenを追加しtokenがセットされた後にも再実行される
  //編集処理(PUT)
  const handleSubmit = async (data: {
    title: string;
    content: string;
    thumbnailImageKey: string;
    categories: { id: number }[];
  }) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("更新しました！");
        router.push("/admin/posts");
      } else {
        alert("更新に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //削除処理(DELETE)
  const handleDelete = async () => {
    if (!token) return;
    const ok = confirm("本当に削除しますか？"); //ユーザーに確認ポップアップを出す
    if (!ok) return; //OKじゃなかったら（キャンセルされたら＝falseされたら）そこで関数の処理を終了する（何もしない）
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("削除しました！");
        router.push("/admin/posts"); //新しいURLを履歴に追加してページ遷移する(前のページに戻れる)
      } else {
        alert("削除に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">記事編集</h1>
      <PostForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        submitLabel="更新"
        showDeleteButton={true}
        disabled={isSubmitting}
      />
    </div>
  );
};
export default EditPostPage;
