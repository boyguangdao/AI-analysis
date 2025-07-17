import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  const { userId, type } = await req.json();
  // type: 'single' | 'vip'
  let price = 399; // 单位：分
  let description = "单次深度分析";
  if (type === "vip") {
    price = 3000;
    description = "月度VIP套餐";
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "alipay", "wechat_pay"],
    line_items: [
      {
        price_data: {
          currency: "cny",
          product_data: { name: description },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    payment_method_options: {
      wechat_pay: {
        client: "web",
      },
    },
    success_url: `${process.env.NEXTAUTH_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/payment-cancel`,
    metadata: {
      userId,
      type,
    },
  });

  return NextResponse.json({ url: session.url });
} 