'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { ChatHeaderProps } from '@/types/chat.types';
import { signOut, useSession } from 'next-auth/react';
import BackendSelector from '@/components/ui/BackendSelector';
import { getActiveBackend } from '@/lib/backend-config';

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
  const [activeBackend, setActiveBackend] = useState<'n8n' | 'python'>('n8n');
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

  // Actualizar el backend activo cuando cambie
  useEffect(() => {
    const backend = getActiveBackend();
    setActiveBackend(backend);
  }, []);

  // Escuchar cambios en localStorage para el backend
  useEffect(() => {
    const handleStorageChange = () => {
      const backend = getActiveBackend();
      setActiveBackend(backend);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios en el backend usando un intervalo
    const interval = setInterval(() => {
      const backend = getActiveBackend();
      setActiveBackend(backend);
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    setShowDropdown(false);
    // Use the current locale from the URL for the redirect
    const locale = window.location.pathname.split('/')[1];
    await signOut({ callbackUrl: `/${locale}/login` });
  };

  // Solo mostrar el selector de modelo si el backend es n8n
  const canChangeModel = activeBackend === 'n8n';
  
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 h-16">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Title with icon */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          </div>
          
          {/* Model selector - Modern pill design */}
          {onModelChange && canChangeModel && (
            <div className="relative" ref={modelDropdownRef}>
              <button 
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200 hover:shadow-sm"
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${currentModel === 'gemini' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                <span className="mr-2">{currentModel === 'gemini' ? t('settings.modelGemini') : t('settings.modelOpenAI')}</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </button>
              
              {showModelDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl py-2 z-10 border border-gray-200/50 dark:border-gray-700/50">
                  <button
                    onClick={() => {
                      if (onModelChange) onModelChange('gemini');
                      setShowModelDropdown(false);
                    }}
                    className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                      currentModel === 'gemini' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-3 ${currentModel === 'gemini' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    {t('settings.modelGemini')}
                  </button>
                  <button
                    onClick={() => {
                      if (onModelChange) onModelChange('openai');
                      setShowModelDropdown(false);
                    }}
                    className={`flex items-center w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                      currentModel === 'openai' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-3 ${currentModel === 'openai' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    {t('settings.modelOpenAI')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Disabled model selector for Python backend */}
          {onModelChange && !canChangeModel && (
            <div className="flex items-center px-3 py-2 text-sm font-medium rounded-xl bg-gray-50 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500 border border-gray-200/50 dark:border-gray-600/30 cursor-not-allowed">
              <div className={`w-2 h-2 rounded-full mr-2 ${currentModel === 'gemini' ? 'bg-blue-400' : 'bg-emerald-400'} opacity-50`} />
              <span className="mr-2">{currentModel === 'gemini' ? t('settings.modelGemini') : t('settings.modelOpenAI')}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          )}
          
          {/* Backend Selector */}
          <div className="hidden sm:block">
            <BackendSelector />
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* User info - Modern design */}
          {session?.user && (
            <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
              <div className="w-7 h-7 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-32 truncate">
                {session.user.name || session.user.email}
              </span>
            </div>
          )}
          
          {/* Settings dropdown - Modern design */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm"
              data-testid="settings-button"
              aria-label={t('settings.title')}
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl py-2 z-10 border border-gray-200/50 dark:border-gray-700/50">
                {/* Mobile-only user info */}
                {session?.user && (
                  <div className="sm:hidden px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {session.user.name || session.user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          En línea
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Mobile-only backend selector */}
                <div className="sm:hidden px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <BackendSelector />
                </div>
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  data-testid="logout-button"
                >
                  <LogOut className="h-4 w-4 mr-3" />
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
