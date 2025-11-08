'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, PaperclipIcon, CheckCircle } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { SourcesView } from './SourcesView';
import { ChatAreaProps, Message } from '@/types/chat.types';
import FileUpload from '@/components/upload/FileUpload';
import { Button } from '@/components/ui/button';

export function ChatArea({ messages, isLoading, onSendMessage, currentModel = 'gemini', conversationId }: ChatAreaProps) {
  const t = useTranslations('chat');
  const [showSources, setShowSources] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
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
  
  // Handler to close file upload when clicking outside
  useEffect(() => {
    if (showFileUpload) {
      const handleClickOutside = (event: MouseEvent) => {
        // Check if the click is outside the file upload component
        const fileUploadEl = document.getElementById('file-upload-container');
        const uploadButtonEl = document.getElementById('upload-button');
        
        if (fileUploadEl && uploadButtonEl && 
            !fileUploadEl.contains(event.target as Node) && 
            !uploadButtonEl.contains(event.target as Node)) {
          setShowFileUpload(false);
        }
      };
      
      // Add event listener
      document.addEventListener('mousedown', handleClickOutside);
      
      // Clean up
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFileUpload]);
  
  // Función para mostrar una notificación temporal
  const showTemporaryNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col bg-slate-50/50 dark:bg-gray-900/50" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-3xl mx-auto px-8">
              {/* Icono de bienvenida */}
              <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              
              {/* Mensaje de bienvenida */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  Tu compañero de estudio espiritual
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Estoy aquí para ayudarte con tus estudios de la Escuela Sabática, 
                  pasajes bíblicos y tu crecimiento espiritual.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preguntas sobre lecciones</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estudio de textos bíblicos</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-base text-gray-500 dark:text-gray-400 mt-6">
                  ¿Qué te gustaría explorar hoy?
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              data-testid={message.role === 'user' ? 'message-user' : 'message-assistant'}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-4xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 ${message.role === 'user' ? 'space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-2 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white'
                }`}>
                  {message.role === 'user' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>
                
                {/* Message content */}
                <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-3xl`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                          .replace(/\n/g, '<br />')
                      }}
                    />
                  </div>
                  
                  {/* Sources button */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3">
                      <button
                        data-testid="view-sources"
                        onClick={() => handleViewSources(message.sources || [])}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors duration-200"
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        {t('interface.viewSources')}
                      </button>
                    </div>
                  )}
                  
                  {/* Timestamp (could be added) */}
                  <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {/* Placeholder for timestamp */}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-4xl">
              {/* AI Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white flex items-center justify-center mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              
              {/* Typing indicator */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm font-medium">{t('interface.typing')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* This div is used to scroll to the bottom */}
        <div ref={endOfMessagesRef} />
      </div>
      
      {/* Chat input area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
      
      {/* File upload overlay */}
      <div className="relative">
        {showFileUpload && (
          <div 
            id="file-upload-container"
            className="absolute bottom-full w-full p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 rounded-t-2xl shadow-xl"
          >
            <FileUpload 
              model={currentModel}
              conversationId={conversationId}
              onUploadComplete={(fileData) => {
                console.log("ChatArea: Archivo subido correctamente", fileData);
                console.log("ChatArea: Conversación ID:", conversationId);
                console.log("ChatArea: fileId/chatbotId recibido:", fileData?.fileId || fileData?.chatbot_id);
                setShowFileUpload(false);
                // Mostrar notificación en lugar de enviar un mensaje
                showTemporaryNotification(t('FileUpload.uploadSuccess'));
              }} 
              onError={(error) => {
                console.error('ChatArea: Error uploading file:', error);
                setShowFileUpload(false);
                showTemporaryNotification(t('FileUpload.uploadError'));
              }} 
            />
          </div>
        )}
      </div>
      
      <SourcesView
        sources={activeSources}
        isOpen={showSources}
        onClose={() => setShowSources(false)}
      />
      
      {/* Notificación moderna */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <div className="flex items-center p-4 text-sm text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 backdrop-blur-lg rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-lg animate-fade-in-out">
            <CheckCircle className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
