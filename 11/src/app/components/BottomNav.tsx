import { Home, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'home' | 'profile';
  onNavigate: (page: 'home' | 'profile') => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto grid grid-cols-2">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-3 transition ${
            currentPage === 'home'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home className={`size-6 mb-1 ${currentPage === 'home' ? 'fill-current' : ''}`} />
          <span className="text-xs font-medium">首页</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center py-3 transition ${
            currentPage === 'profile'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className={`size-6 mb-1 ${currentPage === 'profile' ? 'fill-current' : ''}`} />
          <span className="text-xs font-medium">个人中心</span>
        </button>
      </div>
    </div>
  );
}
