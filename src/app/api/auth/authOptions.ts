import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabase } from "@/utils/supabase";

// 扩展NextAuth类型
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    }
  }
  interface User {
    id: string;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用户名或邮箱", type: "text", placeholder: "用户名或邮箱" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;

        try {
          // 查询用户（支持用户名或邮箱登录）
          const { data: user } = await supabase
            .from("users")
            .select("*")
            .or(`username.eq.${username},email.eq.${username}`)
            .single();

          if (!user) return null;
          // 验证密码
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.username,
            email: user.email
          };
        } catch (error) {
          console.error('登录验证错误：', error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    }
  }
}; 