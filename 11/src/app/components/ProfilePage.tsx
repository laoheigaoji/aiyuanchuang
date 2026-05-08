import { useState } from 'react';
import { User, Package, TrendingUp, History, CreditCard, ChevronRight, Home } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePageProps {
  balance: number;
  purchaseHistory: any[];
  usageDetails: any[];
  detectionHistory: any[];
  onBalanceUpdate: (newBalance: number) => void;
  onAddPurchase: (purchase: any) => void;
  onAddUsageDetail: (detail: any) => void;
}

export default function ProfilePage({
  balance,
  purchaseHistory,
  usageDetails,
  detectionHistory,
  onBalanceUpdate,
  onAddPurchase,
  onAddUsageDetail
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'records' | 'usage' | 'history'>('packages');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // 字数包配置（后台可配置）
  const packages = [
    { id: 1, chars: 10000, price: 9.9, popular: false },
    { id: 2, chars: 50000, price: 39.9, popular: true },
    { id: 3, chars: 200000, price: 129.9, popular: false }
  ];

  const handlePurchase = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedPackage) return;

    // 模拟支付
    toast.loading('正在支付...', { id: 'payment' });

    setTimeout(() => {
      // 增加余额
      onBalanceUpdate(balance + selectedPackage.chars);

      // 添加购买记录
      const purchase = {
        packageId: selectedPackage.id,
        chars: selectedPackage.chars,
        price: selectedPackage.price,
        timestamp: new Date().toISOString(),
        orderId: `ORD${Date.now()}`
      };
      onAddPurchase(purchase);

      // 添加使用明细
      onAddUsageDetail({
        type: 'earn',
        amount: selectedPackage.chars,
        description: `购买 ${selectedPackage.chars.toLocaleString()} 字符包`,
        timestamp: new Date().toISOString()
      });

      toast.success(`购买成功！获得 ${selectedPackage.chars.toLocaleString()} 字`, { id: 'payment' });
      setShowPurchaseModal(false);
      setSelectedPackage(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-3">
              <User className="size-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">我的账户</h2>
              <p className="text-sm opacity-90">个人中心</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm opacity-90 mb-1">剩余可用字数</p>
            <p className="text-4xl font-bold">{balance.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">
              约可检测 {Math.floor(balance / 1000)} 次（按 1000 字 / 次计算）
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-4 border-b">
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-4 text-sm font-medium transition ${
                activeTab === 'packages'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              购买套餐
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 text-sm font-medium transition ${
                activeTab === 'records'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              套餐记录
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`py-4 text-sm font-medium transition ${
                activeTab === 'usage'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              使用明细
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 text-sm font-medium transition ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              检测记录
            </button>
          </div>

          <div className="p-6">
            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">选择字数包</h3>
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border-2 rounded-xl p-5 transition cursor-pointer hover:border-blue-500 ${
                      pkg.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-gray-900">
                            {pkg.chars.toLocaleString()} 字符
                          </h4>
                          {pkg.popular && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                              热门
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          约可检测 {Math.floor(pkg.chars / 1000)} 次
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">¥{pkg.price}</p>
                        <button
                          onClick={() => handlePurchase(pkg)}
                          className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition text-sm"
                        >
                          立即购买
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Purchase Records Tab */}
            {activeTab === 'records' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">购买记录</h3>
                {purchaseHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="size-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">暂无购买记录</p>
                  </div>
                ) : (
                  purchaseHistory.slice().reverse().map((record, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">
                          {record.chars.toLocaleString()} 字符包
                        </span>
                        <span className="text-blue-600 font-bold">¥{record.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>订单号: {record.orderId}</span>
                        <span>{new Date(record.timestamp).toLocaleString('zh-CN')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Usage Details Tab */}
            {activeTab === 'usage' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">使用明细</h3>
                {usageDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="size-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">暂无使用明细</p>
                  </div>
                ) : (
                  usageDetails.slice().reverse().map((detail, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{detail.description}</span>
                        <span
                          className={`font-bold ${
                            detail.type === 'earn' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {detail.type === 'earn' ? '+' : ''}{detail.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(detail.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Detection History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">检测记录</h3>
                {detectionHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="size-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">暂无检测记录</p>
                  </div>
                ) : (
                  detectionHistory.slice().reverse().map((record, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {new Date(record.timestamp).toLocaleString('zh-CN')}
                        </span>
                        <span
                          className={`font-bold ${
                            record.result.aiProbability >= 70
                              ? 'text-red-600'
                              : record.result.aiProbability >= 40
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          AI 概率: {record.result.aiProbability}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-2">"{record.text}"</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{record.charCount} 字</span>
                        <span>{record.result.conclusion}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">确认购买</h3>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">字符包</span>
                <span className="font-semibold text-gray-900">
                  {selectedPackage.chars.toLocaleString()} 字
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">支付金额</span>
                <span className="text-2xl font-bold text-blue-600">
                  ¥{selectedPackage.price}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="size-4" />
                  <span>支付方式: 微信支付（模拟）</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                取消
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                确认支付
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
