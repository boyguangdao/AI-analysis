import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 检查用户使用限制
async function checkUserUsageLimit(userId: string) {
  try {
    // 获取用户信息
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("is_paid_user, daily_usage_count, last_usage_date")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return { canUse: false, error: "用户不存在" };
    }

    const today = new Date().toISOString().split('T')[0];
    
    // 如果是付费用户，无限制
    if (user.is_paid_user) {
      return { canUse: true, isPaid: true };
    }

    // 检查是否需要重置每日使用次数
    if (user.last_usage_date !== today) {
      // 重置每日使用次数
      await supabase
        .from("users")
        .update({ 
          daily_usage_count: 0, 
          last_usage_date: today 
        })
        .eq("id", userId);
      
      return { canUse: true, isPaid: false };
    }

    // 检查免费用户每日使用限制
    if (user.daily_usage_count >= 1) {
      return { canUse: false, error: "免费用户每日只能使用1次，请升级为付费用户" };
    }

    return { canUse: true, isPaid: false };
  } catch (error) {
    console.error('检查用户使用限制错误：', error);
    return { canUse: false, error: "检查使用限制失败" };
  }
}

// 更新用户使用次数
async function updateUserUsage(userId: string) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ 
        daily_usage_count: supabase.rpc('increment', { x: 1 })
      })
      .eq("id", userId);

    if (error) {
      console.error('更新用户使用次数错误：', error);
    }
  } catch (error) {
    console.error('更新用户使用次数错误：', error);
  }
}

// 保存分析记录
async function saveAnalysisRecord(userId: string, contractText: string, result: string, model: string, tokens: number) {
  try {
    const { error } = await supabase
      .from("analysis_records")
      .insert([{
        user_id: userId,
        contract_text: contractText,
        analysis_result: result,
        model_used: model,
        tokens_used: tokens
      }]);

    if (error) {
      console.error('保存分析记录错误：', error);
    }
  } catch (error) {
    console.error('保存分析记录错误：', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { contractText, userId } = await req.json();

    if (!contractText || !userId) {
      return NextResponse.json({ 
        error: "缺少必要参数" 
      }, { status: 400 });
    }

    console.log(`开始分析合同 - 用户: ${userId}, 文本长度: ${contractText.length}`);

    // 检查用户使用限制
    const usageCheck = await checkUserUsageLimit(userId);
    if (!usageCheck.canUse) {
      return NextResponse.json({ 
        error: usageCheck.error 
      }, { status: 403 });
    }

    // 选择模型
    const model = usageCheck.isPaid ? "gpt-4o" : "gpt-3.5-turbo";
    console.log(`使用模型: ${model}`);

    // 调用OpenAI API（强制走代理）
    const agent = new HttpsProxyAgent('http://127.0.0.1:7890');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: "system",
            content: "你是一个专业的合同风险分析专家。请分析用户提供的合同文本，识别潜在的法律风险和问题，并提供具体的建议和改进方案。请用中文回答，格式要清晰易读。"
          },
          {
            role: "user",
            content: `请分析以下合同文本的风险：\n\n${contractText}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    );

    const data = response.data;
    const result = data.choices[0].message.content;
    const tokensUsed = data.usage.total_tokens;

    // 更新用户使用次数
    await updateUserUsage(userId);

    // 保存分析记录
    await saveAnalysisRecord(userId, contractText, result, model, tokensUsed);

    return NextResponse.json({
      result: result,
      model: model,
      tokensUsed: tokensUsed
    });

  } catch (error) {
    console.error('合同分析API错误：', error);
    return NextResponse.json({ 
      error: "服务器错误，请稍后重试" 
    }, { status: 500 });
  }
}