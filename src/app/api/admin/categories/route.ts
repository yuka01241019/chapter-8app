import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();
//管理者　カテゴリー一覧取得API
export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  //送ったtokenが正しくない場合errorが返却されるのでクライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  //tokenが正しい場合以降が実行される
  try {
    // カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc", // 作成日時の降順で取得
      },
    });

    // レスポンスを返す
    return NextResponse.json({ status: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// カテゴリー作成のリクエストボディの型を指定
// カテゴリーの作成時に送られてくるリクエストのbodyの型
interface CreateCategoryRequestBody {
  name: string;
}
//管理者　カテゴリー新規作成API
export const POST = async (request: Request, context: any) => {
const token = request.headers.get("Authorization") ?? "";
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  //送ったtokenが正しくない場合errorが返却されるのでクライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  //tokenが正しい場合以降が実行される
  try {
    // リクエストのbodyを取得
    const body = await request.json();

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body;

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

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
