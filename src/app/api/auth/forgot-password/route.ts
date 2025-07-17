import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "邮箱不能为空" }, { status: 400 });
  }

  // 查找用户
  const { data: user } = await supabase.from("users").select("id, email").eq("email", email).single();
  if (!user) {
    return NextResponse.json({ error: "该邮箱未注册" }, { status: 404 });
  }

  // 生成token和过期时间
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30分钟有效

  // 保存到数据库
  await supabase.from("users").update({
    reset_password_token: token,
    reset_password_expires: expires.toISOString(),
  }).eq("id", user.id);

  // 发送邮件
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `AI合同助手 <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "重置密码 - AI合同助手",
    html: `<p>您好，</p><p>请点击下方链接重置您的密码（30分钟内有效）：</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>如非本人操作请忽略此邮件。</p>`
  });

  return NextResponse.json({ ok: true });
} 