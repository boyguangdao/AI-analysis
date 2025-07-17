"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  order_no: string;
  amount: number;
  type: string;
  status: string;
  payment_method: string;
  created_at: string;
}

export default function OrderPanel() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchOrders = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/history?page=${pageNum}&pageSize=${pageSize}`);
      const data = await res.json();
      setOrders(data.records || []);
      setTotal(data.total || 0);
    } catch (err) {
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6 text-gray-800">交易记录</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-500">加载中...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">暂无交易记录</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-2">下单时间</th>
                <th className="px-3 py-2">订单号</th>
                <th className="px-3 py-2">类型</th>
                <th className="px-3 py-2">金额(元)</th>
                <th className="px-3 py-2">支付方式</th>
                <th className="px-3 py-2">状态</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-blue-50">
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{order.order_no}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{order.type}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{(order.amount / 100).toFixed(2)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{order.payment_method || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{order.status}</td>
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
    </div>
  );
} 