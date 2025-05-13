import { Category } from "@prisma/client";

//サーバーからとってくるとき（取得用）
export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt: string;
  updatedAt: string;
  postCategories: { category: { id: number; name: string } }[];
};

//新規投稿で使うとき（送信用）
export type CreatePost = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: { id: number }[];
};
