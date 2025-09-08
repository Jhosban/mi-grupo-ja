export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  usage?: {
    tokensInput: number;
    tokensOutput: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages?: Message[];
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
}

export interface ChatHeaderProps {
  title: string;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export interface SourceViewProps {
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}
