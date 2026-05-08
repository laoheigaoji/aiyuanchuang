import { User, Package, TrendingUp, History } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function ProfileView({ balance }: { balance: number }) {
  const plans = [
    { name: '10,000 字符', price: '¥9.9', chars: 10000 },
    { name: '50,000 字符', price: '¥39.9', chars: 50000, popular: true },
    { name: '200,000 字符', price: '¥129.9', chars: 200000 },
  ];

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

          <Card className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-none text-white">
            <p className="text-sm opacity-90 mb-1">剩余可用字数</p>
            <p className="text-4xl font-bold">{balance.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">
              约可检测 {Math.floor(balance / 1000)} 次 (按 1000 字 / 次计算)
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg p-2 rounded-2xl">
            <TabsTrigger value="packages">购买套餐</TabsTrigger>
            <TabsTrigger value="records">套餐记录</TabsTrigger>
            <TabsTrigger value="usage">使用明细</TabsTrigger>
            <TabsTrigger value="history">检测记录</TabsTrigger>
          </TabsList>

          <Card className="mt-6">
            <CardContent className="p-6">
              <TabsContent value="packages">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">选择字数包</h3>
                  {plans.map((pkg) => (
                    <div
                      key={pkg.name}
                      className={`border-2 rounded-xl p-5 transition cursor-pointer hover:border-blue-500 ${
                        pkg.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-gray-900">{pkg.name}</h4>
                            {pkg.popular && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                热门
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">约可检测 {Math.floor(pkg.chars / 1000)} 次</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{pkg.price}</p>
                          <Button className="mt-2 rounded-full">
                            立即购买
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              {/* Other tabs remain as placeholders */}
              <TabsContent value="records">
                <div className="text-center py-12 text-gray-500">暂无购买记录</div>
              </TabsContent>
              <TabsContent value="usage">
                <div className="text-center py-12 text-gray-500">暂无使用明细</div>
              </TabsContent>
              <TabsContent value="history">
                <div className="text-center py-12 text-gray-500">暂无检测记录</div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
