import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/utils/supabase";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, is_vip, vip_analysis_count, vip_expire_at')
    .eq('id', session.user.id)
    .single();

  // 日志输出
  console.log('session.user.id', session.user.id);
  console.log('user', user);
  console.log('error', error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user });
} 