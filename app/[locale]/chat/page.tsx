'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { Message, Conversation } from '@/types/chat.types';

// Force dynamic rendering to avoid static generation issues with next-intl
export const dynamic = 'force-dynamic';

// Mock data for development purposes, will be replaced with real API calls
const mockConversations: Conversation[] = [
  { id: '1', title: 'Nueva conversación' },
];

const mockMessages: Message[] = [
  { id: '1', role: 'assistant', content: 'Bienvenido al chat de la escuela sabatica. ¿En qué puedo ayudarte hoy?' },
];

export default function ChatLayout() {
  const t = useTranslations('chat');
  const router = useRouter();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('1');
  
  // State for streaming messages
  const [streamingMessage, setStreamingMessage] = useState('');

  // Get app name from environment variable
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'MiChat';
  
  // Function to create a new conversation
  const handleNewConversation = () => {
    const newId = `new-${Date.now()}`;
    const newConversation = {
      id: newId,
      title: `Conversación ${conversations.length + 1}`,
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newId);
    setMessages([]);
  };
  
  // Function to select an existing conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    // In a real app, you would fetch messages for this conversation here
  };
  
  // Function to send a message
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to the chat
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: message,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage('');
    
    try {
      // Create ID for assistant message
      const assistantMessageId = `assistant-${Date.now()}`;
      let messageContent = '';
      let messageSources: Array<{ title: string; url: string; snippet: string }> = [];
      
      // Add empty assistant message to show immediately
      setMessages((prev) => [...prev, {
        id: assistantMessageId,
        role: 'assistant' as const,
        content: ''
      }]);
      
      // Configure EventSource for SSE - Use POST directly instead of GET with query params
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId: activeConversationId,
          settings: { topK: 5, temperature: 0.7 }
        })
      });
      
      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Set up the reader for the response body stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;
          
          try {
            const eventData = line.replace('data: ', '');
            const parsedData = JSON.parse(eventData);
            
            if (parsedData.type === 'message') {
              messageContent += parsedData.data.content;
              setStreamingMessage(messageContent);
              
              // Update messages
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const assistantMessageIndex = updatedMessages.findIndex(m => m.id === assistantMessageId);
                
                if (assistantMessageIndex >= 0) {
                  updatedMessages[assistantMessageIndex] = {
                    ...updatedMessages[assistantMessageIndex],
                    content: messageContent
                  };
                }
                
                return updatedMessages;
              });
            } else if (parsedData.type === 'sources' && parsedData.data.sources) {
              messageSources = parsedData.data.sources;
              
              // Update messages with sources
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const assistantMessageIndex = updatedMessages.findIndex(m => m.id === assistantMessageId);
                
                if (assistantMessageIndex >= 0) {
                  updatedMessages[assistantMessageIndex] = {
                    ...updatedMessages[assistantMessageIndex],
                    content: messageContent,
                    sources: messageSources
                  };
                }
                
                return updatedMessages;
              });
            } else if (parsedData.type === 'complete') {
              setIsLoading(false);
            } else if (parsedData.type === 'error') {
              console.error('Error from SSE:', parsedData.data.message);
              setIsLoading(false);
            }
          } catch (e) {
            console.error('Error parsing SSE message:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // Show error to the user
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant' as const,
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo.'
      }]);
    }
  };
  
  // Set up settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Sidebar - hidden on small screens by default */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewConversation={handleNewConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader
          title={appName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Settings Modal - can be implemented later if needed */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t('settings.title')}</h2>
            {/* Settings content would go here */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
              >
                {t('settings.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
