/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, User } from 'lucide-react';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ prob: number; status: string } | null>(null);
  const [user, setUser] = useState<{ openId: string; balance: number } | null>(null);

  const openId = new URLSearchParams(window.location.search).get('openId');

  useEffect(() => {
    console.log("App initialized, openId:", openId);
    if (openId) {
      fetch(`/api/user/${openId}`).then(res => res.json()).then(setUser).catch(console.error);
    } else {
      console.log("No openId, redirecting to login");
      window.location.href = '/api/auth/wechat/login';
    }
  }, [openId]);

  const handleDetect = async () => {
    if (text.length < 200 || text.length > 5000) {
      alert('请确保字数在200-5000之间');
      return;
    }
    
    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, openId }),
      });
      const data = await response.json();
      setResult({ prob: (data.Score || 0) / 100, status: data.Suggestion || '检测完成' });
    } catch (err) {
      alert('检测请求失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {activeTab === 'home' ? (
          <HomeView text={text} setText={setText} onDetect={handleDetect} result={result} balance={user?.balance || 0} />
        ) : (
          <ProfileView balance={user?.balance || 0} />
        )}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-6">
        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => setActiveTab('home')}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">首页</span>
        </button>
        <button 
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">个人中心</span>
        </button>
      </nav>
    </div>
  );
}
