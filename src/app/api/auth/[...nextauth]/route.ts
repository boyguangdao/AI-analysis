import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabase } from "@/utils/supabase";
import { authOptions } from "../authOptions";

// 扩展NextAuth类型
// ...（原有类型声明保持不变）

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 