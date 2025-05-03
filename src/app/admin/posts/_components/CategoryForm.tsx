"use client";

import { useEffect, useState } from "react";

//このコンポーネントが受け取る値(props)の型定義
type Props = {
  onSubmit: (name: string) => void; //送信ボタンを押したときの関数(何も返さない関数)
  onDelete?: () => void; //削除ボタンの時だけ使うのでオプショナル(何も返さない関数)
  defaultValue?: string; //初期の入力値（空文字や既存のカテゴリー名）ル
  submitLabel: string; //ボタンに表示するラベル(作成)
};

//カテゴリー新規作成、編集　共通コンポーネント
export const CategoryForm: React.FC<Props> = ({
  onSubmit,
  onDelete,
  defaultValue = "", //propsがなかった時に空文字を使うため = ""としてる
  submitLabel,
}) => {
  const [name, setName] = useState(defaultValue); //カテゴリー名の入力欄の値を保持
  useEffect(() => {
    setName(defaultValue); //defaultValueが変わった時に入力欄も更新(編集ページから新しいカテゴリーが読み込まれたとき用)
  }, [defaultValue]);
  const handleSubmit = async (e: React.FormEvent) => {
    //フォームが送信された時に動く関数
    e.preventDefault(); //フォーム送信時のリロードを防ぐ役割
    onSubmit(name); //今の入力値を外に渡す（親コンポーネントが処理）
  };

  return (
    <form onSubmit={handleSubmit} >
      <label>カテゴリー名</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-stone-300 rounded-lg p-3 w-full mb-4"
      ></input>
      <div className="flex gap-4">
        <button
          type="submit"
          className="py-2 px-4 border block rounded-lg  text-white bg-blue-700"
        >
          {submitLabel}
        </button>
        {/* onDeleteが渡された時だけ削除ボタンを表示するように(個別編集ページ用) */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="py-2 px-4 border block rounded-lg  text-white bg-red-600"
          >削除</button>
        )}
      </div>
    </form>
  );
};
