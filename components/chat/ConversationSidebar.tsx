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
    <div className="w-60 h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-r border-gray-300 dark:border-gray-700/50 flex flex-col">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700/50">
        <div className="space-y-3">
          {/* Nueva conversación */}
          <button
            data-testid="new-conversation"
            onClick={onNewConversation}
            className="flex items-center justify-center gap-2 w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium text-sm"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>{t('interface.newConversation')}</span>
          </button>
          
          {/* Botón de subida de archivos */}
          {onShowFileUpload && (
            <button
              onClick={onShowFileUpload}
              className="flex items-center justify-center gap-2 w-full p-3 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700/50 hover:shadow-sm font-medium text-sm"
            >
              <PaperclipIcon className="h-4 w-4" />
              <span>{t('interface.uploadFile')}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Search Section */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700/50">
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            data-testid="sidebar-search"
            placeholder={t('sidebar.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200"
          />
        </div>
      </div>
      
      {/* Conversations Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t('sidebar.conversations')}
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded-md">
              {filteredConversations.length}
            </span>
          </div>
          
          {filteredConversations.length > 0 ? (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <div key={conversation.id} className="relative group h-15">
                  <div className={`relative overflow-hidden rounded-xl border transition-all duration-200 h-full ${
                    activeConversationId === conversation.id
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800 shadow-md'
                      : 'bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm'
                  }`}>
                    <button
                      onClick={() => onSelectConversation(conversation.id)}
                      className="w-full p-2 h-13 text-left flex items-start justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            activeConversationId === conversation.id
                              ? 'bg-indigo-500'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`} />
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Chat
                            </span>
                            {activeConversationId === conversation.id && (
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" title="Activo" />
                            )}
                          </div>
                        </div>
                        
                        <h3 className={`font-medium text-xs leading-tight ${
                          activeConversationId === conversation.id
                            ? 'text-indigo-900 dark:text-indigo-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {formatConversationTitle(conversation.title || 'Conversación sin título')}
                        </h3>
                      </div>
                    </button>
                    
                    {/* Delete button */}
                    <button 
                      className="absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transform scale-90 hover:scale-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteConversation) {
                          onDeleteConversation(conversation.id);
                        }
                      }}
                      title={t('sidebar.delete')}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center">
                <MessageSquarePlus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'Sin resultados' : 'Sin conversaciones'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-48 mx-auto">
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Inicia una nueva conversación para comenzar'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={onNewConversation}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors duration-200"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Nueva conversación
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
