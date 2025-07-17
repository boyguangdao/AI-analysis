import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/utils/supabase";

// PayJS 配置
const PAYJS_KEY = process.env.PAYJS_KEY!;

// 验证 PayJS 签名
function verifyPayJSSign(params: Record<string, any>): boolean {
  const { sign, ...otherParams } = params;
  const sortedKeys = Object.keys(otherParams).sort();
  const signString = sortedKeys
    .map(key => `${key}=${otherParams[key]}`)
    .join('&') + `&key=${PAYJS_KEY}`;
  
  const expectedSign = crypto.createHash('md5').update(signString).digest('hex').toUpperCase();
  return sign === expectedSign;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const notifyData: Record<string, any> = {};
    
    // 解析回调参数
    for (const [key, value] of params.entries()) {
      notifyData[key] = value;
    }

    // 验证签名
    if (!verifyPayJSSign(notifyData)) {
      console.error('PayJS 签名验证失败');
      return new NextResponse('FAIL', { status: 400 });
    }

    // 检查支付状态
    if (notifyData.result_code !== 1) {
      console.error('PayJS 支付失败:', notifyData.return_msg);
      return new NextResponse('FAIL', { status: 400 });
    }

    // 解析附加数据
    const attach = JSON.parse(notifyData.attach || '{}');
    const { userId, type } = attach;

    // 更新数据库
    // 1. 创建订单记录
    await supabase.from('orders').insert({
      user_id: userId,
      order_no: notifyData.out_trade_no,
      amount: notifyData.total_fee,
      type: type,
      status: 'paid',
      payment_method: 'payjs',
      created_at: new Date().toISOString(),
    });

    // 2. 更新用户权限
    if (type === 'single') {
      // 单次付费：增加一次付费分析次数
      const { data: userData } = await supabase
        .from('users')
        .select('paid_analysis_count')
        .eq('id', userId)
        .single();
      
      const currentCount = userData?.paid_analysis_count || 0;
      await supabase
        .from('users')
        .update({ 
          paid_analysis_count: currentCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } else if (type === 'vip') {
      // VIP套餐：设置VIP状态和次数
      const vipExpireDate = new Date();
      vipExpireDate.setMonth(vipExpireDate.getMonth() + 1); // 30天有效期
      
      await supabase
        .from('users')
        .update({ 
          is_vip: true,
          vip_expire_at: vipExpireDate.toISOString(),
          vip_analysis_count: 50, // VIP套餐50次
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }

    console.log('PayJS 支付成功处理完成:', {
      userId,
      type,
      orderNo: notifyData.out_trade_no,
      amount: notifyData.total_fee
    });

    // 返回成功响应
    return new NextResponse('SUCCESS');
    
  } catch (error) {
    console.error('PayJS 回调处理错误:', error);
    return new NextResponse('FAIL', { status: 500 });
  }
} 