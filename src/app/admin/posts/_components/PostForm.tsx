"use client";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

//このコンポーネントが受け取る値(props)の型定義
type PostFormProps = {
  onSubmit: (data: {
    title: string;
    content: string;
    thumbnailUrl: string;
    categories: { id: number }[];
  }) => Promise<void>;
  onDelete?: () => Promise<void>; //削除機能が必要な場合だけ渡す
  initialData?: {
    title: string;
    content: string;
    thumbnailUrl: string;
    selectedCategoryId: number[];
  };
  submitLabel: string;
  showDeleteButton?: boolean;
  disabled?: boolean;
};

//記事新規作成、編集　共通コンポーネント
export const PostForm: React.FC<PostFormProps> = ({
  onSubmit,
  onDelete,
  initialData,
  submitLabel = "作成",
  showDeleteButton = false,
}) => {
  //title,content,thumbnailUrl,の状態を管理（初期値は空）
  const [title, setTitle] = useState<string>(""); //titleを管理
  const [content, setContent] = useState<string>(""); //本文を管理
  const [thumbnailUrl, setThumbnailUrl] = useState(""); //サムネイルを管理
  const [categories, setCategories] = useState<Category[]>([]); //カテゴリー一覧を管理(配列)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); //選ばれたカテゴリーIDたち　選択状態を保持（新規作成で送信するための用途）
  const [isSubmitting, setIsSubmitting] = useState(false);
  //(編集用)初期データがあればその状態にセット
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setThumbnailUrl(initialData.thumbnailUrl);
      setSelectedCategories(initialData.selectedCategoryId);
    }
  }, [initialData]);

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
    if (selectedCategories.length === 0) {
      alert("カテゴリーを選択してください。");
      return;
    }
    setIsSubmitting(true); //送信中に無効化
    try {
      await onSubmit({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories.map((id) => ({ id })),
      });
    } finally {
      setIsSubmitting(false); //終了後に解除
    }
  };
  //カテゴリー選択変更時の処理
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setSelectedCategories(selected);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>タイトル</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full mb-4"
        disabled={isSubmitting}
      ></input>

      <label>内容</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full mb-4"
        disabled={isSubmitting}
      ></textarea>

      <label>サムネイルURL</label>
      <input
        type="text"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full mb-4"
        disabled={isSubmitting}
      ></input>

      <label>カテゴリー</label>
      <select
        multiple //複数選択できるように
        value={selectedCategories.map(String)}
        onChange={handleChangeCategory}
        className="border border-stone-300 rounded-lg p-3 w-full mb-4"
        disabled={isSubmitting}
      >
        {/* <option value=""></option> */}

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
      <div className="flex gap-4 ">
        <button
          type="submit"
          className="py-2 px-4 border block rounded-lg  text-white bg-blue-700"
          disabled={isSubmitting}
        >
          {submitLabel}
        </button>
        {/* onDeleteが渡された時だけ削除ボタンを表示するように(個別編集ページ用) */}
        {showDeleteButton &&
          onDelete && ( //削除ボタンを表示すべき(true)かつ削除処理の関数が渡されている場合
            <button
              type="button"
              onClick={onDelete}
              className="py-2 px-4 border block rounded-lg  text-white bg-red-600"
              disabled={isSubmitting}
            >
              削除
            </button>
          )}
      </div>
    </form>
  );
};
