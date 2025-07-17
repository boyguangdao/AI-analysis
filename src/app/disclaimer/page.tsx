export default function DisclaimerPage() {
  return (
    <main className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">免责声明</h1>
      <div className="space-y-4 text-gray-700 text-base">
        <p>本服务基于AI模型自动分析合同文本，分析结果仅供参考，不构成法律意见或依据。</p>
        <ul className="list-disc pl-6">
          <li>用户应结合实际情况及专业律师建议做出决策</li>
          <li>平台不对因使用本服务造成的任何直接或间接损失承担责任</li>
          <li>用户上传的内容如涉及违法、侵权等行为，责任由用户自行承担</li>
        </ul>
        <p className="text-xs text-gray-400 mt-6">如您继续使用本服务，即视为同意本免责声明。</p>
      </div>
    </main>
  );
} 