'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { ChatHeaderProps } from '@/types/chat.types';
import { signOut, useSession } from 'next-auth/react';

export function ChatHeader({ 
  title, 
  onToggleSidebar, 
  onOpenSettings, 
  currentModel = 'gemini', 
  onModelChange 
}: ChatHeaderProps) {
  const t = useTranslations('chat');
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
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
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
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
          
          {/* Selector de modelo */}
          {onModelChange && (
            <div className="relative ml-4" ref={modelDropdownRef}>
              <button 
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center px-3 py-1 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
              >
                <span className="mr-1">{currentModel === 'gemini' ? t('settings.modelGemini') : t('settings.modelOpenAI')}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showModelDropdown && (
                <div className="absolute left-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      if (onModelChange) onModelChange('gemini');
                      setShowModelDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentModel === 'gemini' 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t('settings.modelGemini')}
                  </button>
                  <button
                    onClick={() => {
                      if (onModelChange) onModelChange('openai');
                      setShowModelDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentModel === 'openai' 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t('settings.modelOpenAI')}
                  </button>
                </div>
              )}
            </div>
          )}
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
