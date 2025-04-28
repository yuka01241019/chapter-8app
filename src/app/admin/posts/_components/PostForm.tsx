"use client";
import { useEffect, useState } from "react";
import { createPost } from "../new/page";

type Category = {
  id: number;
  name: string;
};

const PostForm: React.FC = () => {
  //title,content,thumbnailUrl,の状態を管理（初期値は空）
  const [title, setTitle] = useState<string>(""); //titleを管理
  const [content, setContent] = useState<string>(""); //本文を管理
  const [thumbnailUrl, setThumbnailUrl] = useState(""); //サムネイルを管理
  const [categories, setCategories] = useState<Category[]>([]); //カテゴリー一覧を管理(配列)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); //選んだカテゴリー

  //★カテゴリー一覧をAPIから取得★
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        setCategories(data.categories); //categories配列をセットする
      } catch (error) {
        console.error("カテゴリー取得エラー", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    //フォームが送信された時に動く関数
    e.preventDefault(); //フォーム送信時のリロードを防ぐ役割
    try {
      if (selectedCategory === null) {
        alert("カテゴリーを選択してください。");
        return;
      }
      await createPost({
        title,
        content,
        thumbnailUrl,
        categories: [{ id: selectedCategory }], //投稿するときは配列で渡す
      });
      alert("投稿に成功しました。");

      //フォームの内容をリセット（送信後に入力欄が空になる）
      setTitle("");
      setContent("");
      setThumbnailUrl("");
      setSelectedCategory(null);
    } catch (error) {
      //エラーの場合
      console.log(error); //エラーの内容をコンソールに表紙
      alert("投稿に失敗しました。");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-lg font-bold mb-9 mt-2">記事編集</h1>
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
      <select
        value={selectedCategory !== null ? String(selectedCategory) : ""}
        onChange={(e) => {
          setSelectedCategory(Number(e.target.value));
        }}
        className="border border-stone-300 rounded-lg p-3 w-full"
      >
        <option value=""></option>

        {categories.map((category) => {
          //カテゴリー一覧データを元に選択肢を自動で作成
          return (
            <option key={category.id} value={category.id}>
              {category.name || "(名前なし)"}{" "}
              {/* category.nameがあればそれを表示、なければ"(名前なし)"を表示 */}
            </option>
          );
        })}
      </select>
      <button
        type="submit"
        className="py-2 px-4 border block rounded-lg  text-white bg-blue-700"
      >
        作成
      </button>
    </form>
  );
};

export default PostForm;
