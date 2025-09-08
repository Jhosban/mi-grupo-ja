'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { Message, Conversation } from '@/types/chat.types';

// Mock data for development purposes, will be replaced with real API calls
const mockConversations: Conversation[] = [
  { id: '1', title: 'Conversación de prueba' },
];

const mockMessages: Message[] = [
  { id: '1', role: 'user', content: 'Hola' },
  { id: '2', role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte hoy?' },
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
      // Crear ID para el mensaje del asistente
      const assistantMessageId = `assistant-${Date.now()}`;
      let messageContent = '';
      let messageSources: Array<{ title: string; url: string; snippet: string }> = [];
      
      // Configurar EventSource para SSE
      const eventSource = new EventSource(`/api/chat/send?data=${encodeURIComponent(JSON.stringify({
        message,
        conversationId: activeConversationId,
        settings: { topK: 5, temperature: 0.7 }
      }))}`);
      
      // Procesar los eventos SSE
      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          
          if (parsedData.type === 'message') {
            messageContent += parsedData.data.content;
            setStreamingMessage(messageContent);
            
            // Actualizar mensajes
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              const assistantMessageIndex = updatedMessages.findIndex(m => m.id === assistantMessageId);
              
              if (assistantMessageIndex >= 0) {
                updatedMessages[assistantMessageIndex] = {
                  ...updatedMessages[assistantMessageIndex],
                  content: messageContent
                };
              } else {
                updatedMessages.push({
                  id: assistantMessageId,
                  role: 'assistant' as const,
                  content: messageContent
                });
              }
              
              return updatedMessages;
            });
          } else if (parsedData.type === 'sources' && parsedData.data.sources) {
            messageSources = parsedData.data.sources;
            
            // Actualizar mensajes con fuentes
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
            // Flujo completo, cerrar conexión
            eventSource.close();
            setIsLoading(false);
          } else if (parsedData.type === 'error') {
            console.error('Error from SSE:', parsedData.data.message);
            eventSource.close();
            setIsLoading(false);
          }
        } catch (e) {
          console.error('Error parsing SSE message:', e);
        }
      };
      
      // Manejar errores
      eventSource.onerror = () => {
        console.error('EventSource failed');
        eventSource.close();
        setIsLoading(false);
      };
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };
  
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
          onOpenSettings={() => {}}
        />
        
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
