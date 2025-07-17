"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface RecordItem {
  id: string;
  contract_text: string;
  analysis_result: string;
  model_used: string;
  tokens_used: number;
  created_at: string;
  type: string;
  expire_at: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailRecord, setDetailRecord] = useState<RecordItem | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecords(page);
    }
    // eslint-disable-next-line
  }, [status, page]);

  const fetchRecords = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analysis/history?page=${pageNum}&pageSize=${pageSize}`);
      const data = await res.json();
      setRecords(data.records || []);
      setTotal(data.total || 0);
    } catch (err) {
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = (record: RecordItem) => {
    setDetailRecord(record);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailRecord(null);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 mt-8"
        >
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">分析历史记录</h1>
          {loading ? (
            <div className="text-center py-12 text-gray-500">加载中...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-gray-400">暂无分析记录</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr>
                    <th className="px-3 py-2">时间</th>
                    <th className="px-3 py-2">类型</th>
                    <th className="px-3 py-2">模型</th>
                    <th className="px-3 py-2">Token数</th>
                    <th className="px-3 py-2">内容摘要</th>
                    <th className="px-3 py-2">结果摘要</th>
                    <th className="px-3 py-2">有效期</th>
                    <th className="px-3 py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id} className="border-b hover:bg-blue-50">
                      <td className="px-3 py-2 whitespace-nowrap">{new Date(rec.created_at).toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{rec.type}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{rec.model_used}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{rec.tokens_used}</td>
                      <td className="px-3 py-2 max-w-xs truncate" title={rec.contract_text}>{rec.contract_text.slice(0, 20)}...</td>
                      <td className="px-3 py-2 max-w-xs truncate" title={rec.analysis_result}>{rec.analysis_result.slice(0, 20)}...</td>
                      <td className="px-3 py-2 whitespace-nowrap">{rec.expire_at ? new Date(rec.expire_at).toLocaleDateString() : '-'}</td>
                      <td className="px-3 py-2">
                        <button className="text-blue-600 hover:underline" onClick={() => handleShowDetail(rec)}>详情</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                className="px-3 py-1 rounded border bg-gray-50 hover:bg-blue-100"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >上一页</button>
              <span className="px-2 py-1">{page} / {totalPages}</span>
              <button
                className="px-3 py-1 rounded border bg-gray-50 hover:bg-blue-100"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >下一页</button>
            </div>
          )}
        </motion.div>
      </div>
      {/* 详情弹窗 */}
      {showDetail && detailRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl" onClick={handleCloseDetail}>×</button>
            <h2 className="text-lg font-bold mb-4 text-center">分析详情</h2>
            <div className="mb-2 text-sm text-gray-500">分析时间：{new Date(detailRecord.created_at).toLocaleString()}</div>
            <div className="mb-2 text-sm text-gray-500">类型：{detailRecord.type}</div>
            <div className="mb-2 text-sm text-gray-500">模型：{detailRecord.model_used}</div>
            <div className="mb-2 text-sm text-gray-500">Token数：{detailRecord.tokens_used}</div>
            <div className="mb-2 text-sm text-gray-500">有效期：{detailRecord.expire_at ? new Date(detailRecord.expire_at).toLocaleDateString() : '-'}</div>
            <div className="mb-4">
              <div className="font-semibold mb-1">合同内容：</div>
              <div className="bg-gray-50 p-3 rounded text-xs whitespace-pre-wrap break-all max-h-40 overflow-auto">{detailRecord.contract_text}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-1">分析结果：</div>
              <div className="bg-blue-50 p-3 rounded text-xs whitespace-pre-wrap break-all max-h-40 overflow-auto">{detailRecord.analysis_result}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 