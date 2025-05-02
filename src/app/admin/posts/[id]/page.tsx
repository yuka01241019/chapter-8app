"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Post = {
  title: string;
  content: string;
  thumbnailUrl: string;
  postCategories: {
    category: Category;
  }[];
};

//記事編集(更新、削除)ページ
const EditPostPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState<string>(""); //titleを管理
  const [content, setContent] = useState<string>(""); //本文を管理
  const [thumbnailUrl, setThumbnailUrl] = useState(""); //サムネイルを管理
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); //カテゴリーIDだけを保持
  const [allCategories, setAllCategories] = useState<Category[]>([]); //カテゴリー一覧全部の情報を保持する役割（UI上にボタン表示するための用途）

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api//admin/posts/${id}`);
      const data = await res.json();
      const post: Post = data.post;

      setTitle(post.title);
      setContent(post.content);
      setThumbnailUrl(post.thumbnailUrl);
      setSelectedCategories(post.postCategories.map((pc) => pc.category.id));
    };
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setAllCategories(data.categories);
    };
    if (id) {
      fetchPost();
      fetchCategories();
    }
  }, [id]);
  //編集処理(PUT)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories.map((id) => ({ id })), //APIに合わせてオブジェクト形式に
      }),
    });

    if (res.ok) {
      alert("更新しました！");
      router.push("/admin/posts");
    } else {
      alert("更新に失敗しました");
    }
  };

  //削除処理(DELETE)
  const handleDelete = async () => {
    const ok = confirm("本当に削除しますか？"); //ユーザーに確認ポップアップを出す
    if (!ok) return; //OKじゃなかったら（キャンセルされたら＝falseされたら）そこで関数の処理を終了する（何もしない）
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("削除しました！");
      router.push("/admin/posts"); //新しいURLを履歴に追加してページ遷移する(前のページに戻れる)
    } else {
      alert("削除に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-4">記事編集</h1>
      <label>タイトル</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></input>

      <label>内容</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></textarea>

      <label>サムネイルURL</label>
      <input
        type="text"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full"
      ></input>
      <label>カテゴリー</label>
      <select multiple value={selectedCategories.map(String)}
      onChange={(e)=>{
      const selected = Array.from(e.target.selectedOptions, (option) =>
            Number(option.value)
          );
          setSelectedCategories(selected);
      }}
      className="border border-stone-300 rounded-lg p-3 w-full">
      {allCategories.map((category) => {
          //カテゴリー一覧データを元に選択肢を自動で作成
          return (
            <option key={category.id} value={category.id}>
              {category.name || "(名前なし)"}{" "}
              {/* category.nameがあればそれを表示、なければ"(名前なし)"を表示 */}
            </option>
          );
        })}
      </select>
      <div className="flex gap-4">
      <button type="submit" className="py-2 px-4 border block rounded-lg  text-white bg-blue-700">更新</button>
      <button type="button" onClick={handleDelete} className="py-2 px-4 border block rounded-lg  text-white bg-red-600">削除</button>
    </div>
    </form>
  );
};
export default EditPostPage;
