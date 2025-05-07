import { create } from 'zustand';
import { Conversation, Message } from '../types';
import { conversations, messages as mockMessages } from '../data/mockData';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  setActiveConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markAsRead: (conversationId: string, messageId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: conversations,
  activeConversationId: null,
  messages: mockMessages,
  isLoading: false,
  error: null,
  
  setActiveConversation: (id: string) => {
    set({ activeConversationId: id });
    
    // Mark all messages as read when conversation is opened
    const conversationMessages = get().messages[id] || [];
    const updatedMessages = { ...get().messages };
    
    if (conversationMessages.length > 0) {
      updatedMessages[id] = conversationMessages.map(msg => ({
        ...msg,
        read: true
      }));
      
      // Update unread count in conversation
      const updatedConversations = get().conversations.map(conv => {
        if (conv.id === id) {
          return {
            ...conv,
            unreadCount: 0
          };
        }
        return conv;
      });
      
      set({ 
        messages: updatedMessages,
        conversations: updatedConversations
      });
    }
  },
  
  sendMessage: (conversationId: string, content: string) => {
    const currentMessages = get().messages[conversationId] || [];
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: '1', // Current user ID
      content,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text'
    };
    
    // Update messages
    const updatedMessages = {
      ...get().messages,
      [conversationId]: [...currentMessages, newMessage]
    };
    
    // Update conversation with last message
    const updatedConversations = get().conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: newMessage
        };
      }
      return conv;
    });
    
    set({
      messages: updatedMessages,
      conversations: updatedConversations
    });
  },
  
  markAsRead: (conversationId: string, messageId: string) => {
    const conversationMessages = get().messages[conversationId] || [];
    const updatedMessages = { ...get().messages };
    
    updatedMessages[conversationId] = conversationMessages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, read: true };
      }
      return msg;
    });
    
    set({ messages: updatedMessages });
  }
}));