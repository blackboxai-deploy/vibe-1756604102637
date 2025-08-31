'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentPage: 'dashboard' | 'keys' | 'stats' | 'docs';
}

export default function Navigation({ currentPage }: NavigationProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'keys', label: 'API Keys', path: '/dashboard/keys' },
    { id: 'stats', label: 'Statistics', path: '/dashboard/stats' },
    { id: 'docs', label: 'API Docs', path: '/docs' }
  ];

  return (
    <nav className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">API Key Manager</h1>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-500"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}