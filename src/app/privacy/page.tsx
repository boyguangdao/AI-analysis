export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">隐私政策</h1>
      <div className="space-y-4 text-gray-700 text-base">
        <p>我们非常重视您的隐私和个人信息保护。本隐私政策将说明我们如何收集、使用、存储和保护您的信息。</p>
        <h2 className="text-lg font-semibold mt-4">1. 信息收集</h2>
        <ul className="list-disc pl-6">
          <li>注册/登录时收集您的邮箱、用户名等信息</li>
          <li>您在使用本服务过程中上传的合同文本、分析结果等数据</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">2. 信息使用</h2>
        <ul className="list-disc pl-6">
          <li>用于身份验证、服务提供、功能优化</li>
          <li>用于分析和改进产品体验</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">3. 信息存储与保护</h2>
        <ul className="list-disc pl-6">
          <li>您的数据将加密存储在安全的云数据库中</li>
          <li>我们承诺不会将您的个人信息出售或泄露给第三方</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">4. 用户权利</h2>
        <ul className="list-disc pl-6">
          <li>您有权随时访问、更正或删除您的个人信息</li>
          <li>如有疑问可通过联系我们获得帮助</li>
        </ul>
        <h2 className="text-lg font-semibold mt-4">5. 政策更新</h2>
        <p>我们可能会不定期更新本政策，更新后会在本页面公示。</p>
        <p className="text-xs text-gray-400 mt-6">如您继续使用本服务，即视为同意本隐私政策。</p>
      </div>
    </main>
  );
} 