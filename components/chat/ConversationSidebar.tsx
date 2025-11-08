'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MessageSquarePlus, PaperclipIcon, Trash2, MoreVertical } from 'lucide-react';
import { ConversationSidebarProps } from '@/types/chat.types';

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onShowFileUpload,
  currentModel,
}: ConversationSidebarProps) {
  const t = useTranslations('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Format conversation title to ensure date and time are fully visible
  const formatConversationTitle = (title: string) => {
    // Si el título contiene "Conversación", extraer solo la parte de la fecha
    if (title.includes('Conversación')) {
      const parts = title.split('Conversación ');
      if (parts.length > 1) {
        return parts[1];
      }
    }
    // Si es solo una fecha, formatearla mejor
    if (title.match(/^\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}$/)) {
      const [datePart, timePart] = title.split(', ');
      const [day, month, year] = datePart.split('/');
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthName = monthNames[parseInt(month) - 1];
      return `${day} ${monthName} ${year} • ${timePart}`;
    }
    return title;
  };

  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter((conv) =>
        (conv.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <div className="w-64 h-full border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* New conversation button */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <button
          data-testid="new-conversation"
          onClick={onNewConversation}
          className="flex items-center justify-center gap-2 w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors mb-2"
        >
          <MessageSquarePlus className="h-5 w-5" />
          <span>{t('interface.newConversation')}</span>
        </button>
        
        {/* Botón de subida de archivos */}
        {onShowFileUpload && (
          <button
            onClick={onShowFileUpload}
            className="flex items-center justify-center gap-2 w-full p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
          >
            <PaperclipIcon className="h-5 w-5" />
            <span>{t('interface.uploadFile')}</span>
          </button>
        )}
      </div>
      
      {/* Search input */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          data-testid="sidebar-search"
          placeholder={t('sidebar.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-1">
          {t('sidebar.conversations')}
        </h2>
        
        {filteredConversations.length > 0 ? (
          <ul className="space-y-2">{/* Changed from space-y-1 to space-y-2 */}
            {filteredConversations.map((conversation) => (
              <li key={conversation.id} className="relative">
                <div className={`w-full p-3 rounded-lg flex items-center justify-between group transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                }`}>
                  <button
                    onClick={() => onSelectConversation(conversation.id)}
                    className="flex-grow text-left overflow-hidden mr-2"
                  >
                    <div className="w-full">
                      <span className={`block font-medium text-sm leading-tight ${
                        activeConversationId === conversation.id
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {formatConversationTitle(conversation.title || 'Conversación sin título')}
                      </span>
                    </div>
                  </button>
                  
                  <button 
                    className={`p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 ${
                      activeConversationId === conversation.id ? 'opacity-100' : ''
                    } text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 flex-shrink-0`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteConversation) {
                        onDeleteConversation(conversation.id);
                      }
                    }}
                    title={t('sidebar.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No se encontraron conversaciones' : t('sidebar.noConversations')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
