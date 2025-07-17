export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">用户协议</h1>
      <div className="space-y-4 text-gray-700 text-base">
        <p>欢迎使用本AI合同风险分析助手（以下简称“本服务”）。请您仔细阅读并同意以下协议后再使用本服务。</p>
        <h2 className="text-lg font-semibold mt-4">1. 服务内容</h2>
        <ul className="list-disc pl-6">
          <li>本服务为用户提供合同文本智能分析、风险提示等功能</li>
          <li>分析结果仅供参考，不构成法律意见</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">2. 用户义务</h2>
        <ul className="list-disc pl-6">
          <li>用户应保证上传内容的合法性，不得上传违法、侵权、涉密等内容</li>
          <li>不得利用本服务从事任何违法活动</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">3. 免责声明</h2>
        <ul className="list-disc pl-6">
          <li>本服务分析结果基于AI模型自动生成，无法保证100%准确</li>
          <li>因用户使用本服务造成的任何损失，平台不承担法律责任</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">4. 服务变更与终止</h2>
        <ul className="list-disc pl-6">
          <li>平台有权根据实际情况调整、暂停或终止部分或全部服务</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">5. 其他</h2>
        <ul className="list-disc pl-6">
          <li>本协议未尽事宜，适用国家相关法律法规</li>
        </ul>
        <p className="text-xs text-gray-400 mt-6">如您继续使用本服务，即视为同意本用户协议。</p>
      </div>
    </main>
  );
} 