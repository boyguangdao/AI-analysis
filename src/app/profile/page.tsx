"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// 复用历史记录组件
import HistoryPanel from "../history/page";
import OrderPanel from "./OrderPanel";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  console.log("前端 session.user.id =", session?.user?.id);
  const router = useRouter();
  const [tab, setTab] = useState("info");
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
    // eslint-disable-next-line
  }, [status]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfile(data.user || null);
    } catch (err) {
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center py-20 text-gray-500">加载中...</div>;
  }
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-6 font-sans">
      <div className="max-w-5xl mx-auto flex gap-8">
        {/* 侧边栏 */}
        <aside className="w-48 bg-white rounded-xl shadow-lg p-6 mt-8 flex flex-col space-y-4">
          <button
            className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${tab === "info" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}`}
            onClick={() => setTab("info")}
          >
            基本信息
          </button>
          <button
            className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${tab === "history" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}`}
            onClick={() => setTab("history")}
          >
            分析历史
          </button>
          <button
            className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${tab === "orders" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}`}
            onClick={() => setTab("orders")}
          >
            交易记录
          </button>
        </aside>
        {/* 内容区 */}
        <section className="flex-1 mt-8">
          {tab === "info" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-800">基本信息</h2>
              {loadingProfile ? (
                <div className="text-gray-500">加载中...</div>
              ) : profile ? (
                <div className="mb-4 text-gray-700 space-y-2">
                  <div><span className="font-semibold">邮箱：</span>{profile.email}</div>
                  <div><span className="font-semibold">VIP状态：</span>{profile.is_vip ? 'VIP用户' : '普通用户'}</div>
                  <div><span className="font-semibold">VIP剩余次数：</span>{profile.vip_analysis_count ?? '-'}</div>
                  <div><span className="font-semibold">VIP到期时间：</span>{profile.vip_expire_at ? new Date(profile.vip_expire_at).toLocaleString() : '-'}</div>
                </div>
              ) : (
                <div className="text-red-500">用户信息加载失败</div>
              )}
            </motion.div>
          )}
          {tab === "history" && <HistoryPanel />}
          {tab === "orders" && <OrderPanel />}
        </section>
      </div>
    </main>
  );
} 