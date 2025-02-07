"use client";

import Link from "next/link";
import { Post } from "../_types/Post";

type ArticlesCardProps = {
  post: Post;
};

export const ArticlesCard: React.FC<ArticlesCardProps> = ({ post }) => {
  const date = new Date(post.createdAt).toLocaleDateString("ja-JP");
  return (
    <Link
      href={`/posts/${post.id}`}
      className={`block border border-gray-400 my-8 mx-auto py-4 pl-6 pr-20 w-[800px] max-w-[800px]`}//border-noneは不必要なので削除
    >
      <div className="text-sm float-left">{date}</div>
      <div className="float-right">
        {post.categories.map((category, index) => (
          <button
            key={index}
            className="px-2 py-0 mx-1 text-blue-500 border border-blue-500  rounded"
          >
            {category}
          </button>
        ))}
      </div>
      <div className="clear-both text-left pt-4">{post.title}</div>
      <div
        className="pt-4 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </Link>
  );
};
