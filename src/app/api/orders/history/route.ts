import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/utils/supabase";

export async function GET(req: NextRequest) {
  // 获取当前登录用户
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  // 分页参数
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 查询订单记录
  const { data, error, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    records: data,
    total: count,
    page,
    pageSize
  });
} 