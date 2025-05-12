import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { request } from "http";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

//管理者　カテゴリー個別取得API
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  //送ったtokenが正しくない場合errorが返却されるのでクライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const { id } = params;
  //tokenが正しい場合以降が実行される
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ status: "OK", category });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message });
  }
};

// カテゴリーの更新時に送られてくるリクエストのbodyの型
interface UpdateCategoryRequestBody {
  name: string;
}
//管理者　カテゴリー更新API
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  //送ったtokenが正しくない場合errorが返却されるのでクライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const { id } = params;
  const { name }: UpdateCategoryRequestBody = await request.json();
  //tokenが正しい場合以降が実行される
  try {
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    return NextResponse.json({ status: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

//管理者　カテゴリー削除API
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get("Authorization") ?? "";
  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  //送ったtokenが正しくない場合errorが返却されるのでクライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });
  const { id } = params;
  //tokenが正しい場合以降が実行される
  try {
    // idを指定して、Categoryを削除
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
