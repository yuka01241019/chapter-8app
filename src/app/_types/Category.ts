//カテゴリーの型指定

//取得用
export type Category = {
  id: number;
  name: string;
};

//送信用
export type CreateCategory = {
  name: string;
};
