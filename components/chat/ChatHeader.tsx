'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Settings, LogOut, User } from 'lucide-react';
import { ChatHeaderProps } from '@/types/chat.types';
import { signOut, useSession } from 'next-auth/react';

export function ChatHeader({ title, onToggleSidebar, onOpenSettings }: ChatHeaderProps) {
  const t = useTranslations('chat');
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    setShowDropdown(false);
    // Use the current locale from the URL for the redirect
    const locale = window.location.pathname.split('/')[1];
    await signOut({ callbackUrl: `/${locale}/login` });
  };
  
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>
        
        <div className="flex items-center">
          {session?.user && (
            <div className="mr-4 flex items-center">
              <User className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {session.user.name || session.user.email}
              </span>
            </div>
          )}
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              data-testid="settings-button"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">{t('settings.title')}</span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={onOpenSettings}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t('settings.title')}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  data-testid="logout-button"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('settings.logout') || 'Cerrar sesión'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
