'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { SourcesView } from './SourcesView';
import { ChatAreaProps, Message } from '@/types/chat.types';

export function ChatArea({ messages, isLoading, onSendMessage }: ChatAreaProps) {
  const t = useTranslations('chat');
  const [showSources, setShowSources] = useState(false);
  const [activeSources, setActiveSources] = useState<Array<{ title: string; url: string; snippet: string }>>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the bottom of the message list when messages change or a new message arrives
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle click on "View Sources" button
  const handleViewSources = (sources: Array<{ title: string; url: string; snippet: string }>) => {
    setActiveSources(sources);
    setShowSources(true);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {t('sidebar.noConversations')}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              data-testid={message.role === 'user' ? 'message-user' : 'message-assistant'}
              className={`flex flex-col ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2">
                  <button
                    data-testid="view-sources"
                    onClick={() => handleViewSources(message.sources || [])}
                    className="inline-flex items-center text-sm text-blue-500 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {t('interface.viewSources')}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div data-testid="message-assistant" className="flex flex-col items-start">
            <div className="max-w-3xl rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-300"></div>
                <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-600"></div>
                <span className="ml-2">{t('interface.typing')}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* This div is used to scroll to the bottom */}
        <div ref={endOfMessagesRef} />
      </div>
      
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      
      <SourcesView
        sources={activeSources}
        isOpen={showSources}
        onClose={() => setShowSources(false)}
      />
    </div>
  );
}
