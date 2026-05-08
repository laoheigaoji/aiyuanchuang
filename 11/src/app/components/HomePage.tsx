import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface HomePageProps {
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
  onAddHistory: (record: any) => void;
  onAddUsageDetail: (detail: any) => void;
  adWatchedToday: number;
  onAdWatch: () => void;
}

export default function HomePage({
  balance,
  onBalanceUpdate,
  onAddHistory,
  onAddUsageDetail,
  adWatchedToday,
  onAdWatch
}: HomePageProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const charCount = text.length;
  const isValidLength = charCount >= 200 && charCount <= 5000;
  const hasEnoughBalance = balance >= charCount;

  // 模拟腾讯云 AI 检测 API
  const simulateAIDetection = (content: string): Promise<any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟 AI 生成概率（0-100）
        const aiProbability = Math.floor(Math.random() * 100);

        let conclusion = '';
        if (aiProbability >= 70) {
          conclusion = 'AI 生成';
        } else if (aiProbability >= 40) {
          conclusion = '疑似人工';
        } else {
          conclusion = '人工撰写';
        }

        resolve({
          aiProbability,
          conclusion,
          analyzedText: content,
          timestamp: new Date().toISOString()
        });
      }, 2000);
    });
  };

  const handleDetect = async () => {
    if (!isValidLength) {
      toast.error('请输入 200-5000 字的文本');
      return;
    }

    if (!hasEnoughBalance) {
      toast.error('字数余额不足，请充值或观看广告');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const detectionResult = await simulateAIDetection(text);

      // 扣除字数
      const newBalance = balance - charCount;
      onBalanceUpdate(newBalance);

      // 添加使用明细
      onAddUsageDetail({
        type: 'consume',
        amount: -charCount,
        description: 'AI 检测扣费',
        timestamp: new Date().toISOString()
      });

      // 添加检测记录
      onAddHistory({
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        fullText: text,
        result: detectionResult,
        charCount,
        timestamp: new Date().toISOString()
      });

      setResult(detectionResult);
      toast.success('检测完成！');
    } catch (error) {
      toast.error('检测失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = () => {
    if (adWatchedToday >= 5) {
      toast.error('今日观看广告次数已达上限（5次）');
      return;
    }

    // 模拟观看广告（实际应调用广告 SDK）
    toast.loading('正在加载广告...', { id: 'ad-loading' });

    setTimeout(() => {
      const earnedChars = 1000;
      onBalanceUpdate(balance + earnedChars);
      onAdWatch();

      onAddUsageDetail({
        type: 'earn',
        amount: earnedChars,
        description: `观看广告奖励（今日第${adWatchedToday + 1}次）`,
        timestamp: new Date().toISOString()
      });

      toast.success(`恭喜获得 ${earnedChars} 字！`, { id: 'ad-loading' });
    }, 1500);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const getResultColor = (probability: number) => {
    if (probability >= 70) return 'text-red-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getResultIcon = (probability: number) => {
    if (probability >= 70) return <AlertCircle className="size-8" />;
    if (probability >= 40) return <AlertCircle className="size-8" />;
    return <CheckCircle2 className="size-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI 文案检测</h1>
              <p className="text-sm text-gray-600 mt-1">识别文本是否由 AI 生成</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">剩余字数</p>
              <p className="text-3xl font-bold text-blue-600">{balance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Ad Button */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="size-8" />
              <div>
                <p className="font-semibold">观看广告领取 1000 字</p>
                <p className="text-sm opacity-90">今日剩余次数: {5 - adWatchedToday}/5</p>
              </div>
            </div>
            <button
              onClick={handleWatchAd}
              disabled={adWatchedToday >= 5}
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adWatchedToday >= 5 ? '已达上限' : '立即观看'}
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-900">输入待检测文本</label>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isValidLength ? 'text-green-600' : 'text-gray-500'}`}>
                  {charCount} / 5000 字
                </span>
                {charCount > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="请输入 200-5000 字的文本内容，系统将分析其 AI 生成概率..."
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-gray-900"
              disabled={loading}
            />

            <div className="flex items-center gap-3">
              {charCount < 200 && charCount > 0 && (
                <p className="text-sm text-orange-600">⚠️ 至少需要 200 字</p>
              )}
              {charCount > 5000 && (
                <p className="text-sm text-red-600">⚠️ 最多支持 5000 字</p>
              )}
              {!hasEnoughBalance && charCount > 0 && (
                <p className="text-sm text-red-600">⚠️ 字数余额不足</p>
              )}
            </div>

            <button
              onClick={handleDetect}
              disabled={loading || !isValidLength || !hasEnoughBalance}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  检测中...
                </>
              ) : (
                `开始检测（扣除 ${charCount} 字）`
              )}
            </button>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-bold text-lg text-gray-900 mb-4">检测结果</h2>

            <div className="space-y-6">
              {/* AI Probability */}
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <div className={`flex items-center justify-center gap-3 mb-3 ${getResultColor(result.aiProbability)}`}>
                  {getResultIcon(result.aiProbability)}
                  <span className="text-5xl font-bold">{result.aiProbability}%</span>
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-1">AI 生成概率</p>
                <p className={`text-lg font-medium ${getResultColor(result.aiProbability)}`}>
                  {result.conclusion}
                </p>
              </div>

              {/* Interpretation */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-2">📊 结果解读</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 70-100%: 高概率 AI 生成，建议人工审核</li>
                  <li>• 40-69%: 疑似 AI 辅助或混合创作</li>
                  <li>• 0-39%: 大概率人工撰写</li>
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">检测字数</p>
                  <p className="text-2xl font-bold text-gray-900">{charCount}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">检测时间</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(result.timestamp).toLocaleTimeString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
