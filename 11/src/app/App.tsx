import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import BottomNav from './components/BottomNav';

interface UserData {
  balance: number;
  purchaseHistory: any[];
  usageDetails: any[];
  detectionHistory: any[];
  isNewUser: boolean;
  lastLoginDate: string;
  adWatchedToday: number;
  adWatchDate: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile'>('home');
  const [userData, setUserData] = useState<UserData>({
    balance: 0,
    purchaseHistory: [],
    usageDetails: [],
    detectionHistory: [],
    isNewUser: true,
    lastLoginDate: '',
    adWatchedToday: 0,
    adWatchDate: ''
  });

  // 初始化用户数据
  useEffect(() => {
    const savedData = localStorage.getItem('aiDetectorUserData');
    const today = new Date().toDateString();

    if (savedData) {
      const parsed = JSON.parse(savedData);

      // 检查是否是新的一天
      const isNewDay = parsed.lastLoginDate !== today;
      const isNewAdDay = parsed.adWatchDate !== today;

      if (isNewDay && !parsed.isNewUser) {
        // 每日登录奖励
        parsed.balance += 1000;
        parsed.usageDetails.push({
          type: 'earn',
          amount: 1000,
          description: '每日登录奖励',
          timestamp: new Date().toISOString()
        });
      }

      if (isNewAdDay) {
        parsed.adWatchedToday = 0;
        parsed.adWatchDate = today;
      }

      parsed.lastLoginDate = today;
      setUserData(parsed);
      localStorage.setItem('aiDetectorUserData', JSON.stringify(parsed));
    } else {
      // 新用户首次登录
      const newUserData: UserData = {
        balance: 5000,
        purchaseHistory: [],
        usageDetails: [
          {
            type: 'earn',
            amount: 5000,
            description: '新用户注册奖励',
            timestamp: new Date().toISOString()
          }
        ],
        detectionHistory: [],
        isNewUser: false,
        lastLoginDate: today,
        adWatchedToday: 0,
        adWatchDate: today
      };
      setUserData(newUserData);
      localStorage.setItem('aiDetectorUserData', JSON.stringify(newUserData));
    }
  }, []);

  // 保存数据到 localStorage
  const saveUserData = (newData: UserData) => {
    setUserData(newData);
    localStorage.setItem('aiDetectorUserData', JSON.stringify(newData));
  };

  const handleBalanceUpdate = (newBalance: number) => {
    saveUserData({ ...userData, balance: newBalance });
  };

  const handleAddHistory = (record: any) => {
    saveUserData({
      ...userData,
      detectionHistory: [...userData.detectionHistory, record]
    });
  };

  const handleAddUsageDetail = (detail: any) => {
    saveUserData({
      ...userData,
      usageDetails: [...userData.usageDetails, detail]
    });
  };

  const handleAddPurchase = (purchase: any) => {
    saveUserData({
      ...userData,
      purchaseHistory: [...userData.purchaseHistory, purchase]
    });
  };

  const handleAdWatch = () => {
    saveUserData({
      ...userData,
      adWatchedToday: userData.adWatchedToday + 1
    });
  };

  return (
    <div className="size-full bg-gray-50">
      <Toaster position="top-center" richColors />

      {currentPage === 'home' && (
        <HomePage
          balance={userData.balance}
          onBalanceUpdate={handleBalanceUpdate}
          onAddHistory={handleAddHistory}
          onAddUsageDetail={handleAddUsageDetail}
          adWatchedToday={userData.adWatchedToday}
          onAdWatch={handleAdWatch}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          balance={userData.balance}
          purchaseHistory={userData.purchaseHistory}
          usageDetails={userData.usageDetails}
          detectionHistory={userData.detectionHistory}
          onBalanceUpdate={handleBalanceUpdate}
          onAddPurchase={handleAddPurchase}
          onAddUsageDetail={handleAddUsageDetail}
        />
      )}

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}