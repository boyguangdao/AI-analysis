import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get('orderNo');

    if (!orderNo) {
      return NextResponse.json({ error: '订单号不能为空' }, { status: 400 });
    }

    // 查询订单状态
    const { data: order, error } = await supabase
      .from('orders')
      .select('status')
      .eq('order_no', orderNo)
      .single();

    if (error) {
      console.error('查询订单状态失败:', error);
      return NextResponse.json({ error: '查询订单失败' }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ paid: false, message: '订单不存在' });
    }

    return NextResponse.json({
      paid: order.status === 'paid',
      status: order.status
    });

  } catch (error) {
    console.error('检查支付状态错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 