import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/utils/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const type = session.metadata?.type;

    // 1. 创建订单
    await supabase.from("orders").insert([{
      user_id: userId,
      type,
      amount: session.amount_total! / 100,
      status: "paid"
    }]);

    // 2. 更新用户权益
    if (type === "single") {
      // 标记用户有一次单次付费分析资格
      // 这里建议在 users 表加 has_single_pay 字段，或在 analysis_records 插入一条有效期30天的记录
      // 示例：
      // await supabase.from("users").update({ has_single_pay: true }).eq("id", userId);
    } else if (type === "vip") {
      // 更新VIP到期时间和次数
      await supabase.from("users").update({
        vip_expire_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        vip_gpt4o_quota: 50
      }).eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
} 