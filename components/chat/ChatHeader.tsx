'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, Settings } from 'lucide-react';
import { ChatHeaderProps } from '@/types/chat.types';

export function ChatHeader({ title, onToggleSidebar, onOpenSettings }: ChatHeaderProps) {
  const t = useTranslations('chat');
  
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
        
        <div>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">{t('settings.title')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
