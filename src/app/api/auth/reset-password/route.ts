import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "密码至少6位" }, { status: 400 });
  }

  // 查找用户
  const { data: user } = await supabase
    .from("users")
    .select("id, reset_password_expires")
    .eq("reset_password_token", token)
    .single();
  if (!user) {
    return NextResponse.json({ error: "链接无效或已过期" }, { status: 400 });
  }
  if (!user.reset_password_expires || new Date(user.reset_password_expires) < new Date()) {
    return NextResponse.json({ error: "链接已过期" }, { status: 400 });
  }

  // 更新密码
  const hash = await bcrypt.hash(password, 10);
  await supabase.from("users").update({
    password: hash,
    reset_password_token: null,
    reset_password_expires: null,
  }).eq("id", user.id);

  return NextResponse.json({ ok: true });
} 