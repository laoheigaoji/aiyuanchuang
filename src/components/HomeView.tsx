import { useState } from 'react';
import { CheckCircle2, AlertCircle, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface Props {
  text: string;
  setText: (text: string) => void;
  onDetect: () => void;
  result: { prob: number; status: string } | null;
  balance: number;
}

export default function HomeView({ text, setText, onDetect, result, balance }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">AI 文案检测</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">识别文本是否由 AI 生成</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">剩余字数</p>
                <p className="text-3xl font-bold text-blue-600">{balance.toLocaleString()}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ad Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="size-8" />
            <div>
              <p className="font-semibold">观看广告领取 1000 字</p>
              <p className="text-sm opacity-90">今日剩余次数: 5/5</p>
            </div>
          </div>
          <Button variant="secondary" className="rounded-full font-semibold">
            立即观看
          </Button>
        </div>

        {/* Input Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="font-semibold text-gray-900">输入待检测文本</label>
              <span className="text-sm text-gray-500">{text.length} / 5000 字</span>
            </div>
            <textarea
              className="w-full h-64 p-4 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-gray-900"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="请输入 200-5000 字的文本内容，系统将分析其 AI 生成概率..."
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          className="w-full h-14 text-lg"
          onClick={onDetect}
        >
          开始检测 (扣除 {text.length} 字)
        </Button>

        {/* Result Area */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>检测结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center gap-3 mb-2 text-blue-600">
                  {result.prob >= 0.5 ? <AlertCircle className="size-8" /> : <CheckCircle2 className="size-8" />}
                  <span className="text-5xl font-bold">{(result.prob * 100).toFixed(0)}%</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{result.status}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
