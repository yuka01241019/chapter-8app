//サーバーからとってくるとき用
export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl:string;
  createdAt: string;
  updatedAt:string;
  categories: { id: number; name: string }[];
};

//新規投稿で使うとき用
export type CreatePost={
  id: number;
  title: string;
  content: string;
  thumbnailUrl:string;
  createdAt: string;
  updatedAt:string;
  categories: { id: number }[];
}