import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

//管理者　記事一覧取得API
export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  //送ったtokenが正しくない場合errorが返却されるのでクライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  //tokenが正しい場合以降が実行される
  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ status: "OK", posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
// 記事作成のリクエストボディの型
interface CreatePostRequestBody {
  title: string;
  content: string;
  categories: { id: number }[]; //オブジェクトの配列
  thumbnailImageKey: string;
}

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
//管理者　記事新規作成API
export const POST = async (request: NextRequest, context: any) => {
  try {
    // リクエストのbodyを取得
    const body = await request.json();

    // bodyの中からtitle, content, categories, thumbnailUrlを取り出す
    const { title, content, categories, thumbnailImageKey }: CreatePostRequestBody =
      body;

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      });
    }

    // レスポンスを返す
    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
