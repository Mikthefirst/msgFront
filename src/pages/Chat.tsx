import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ConversationList from '../components/chat/ConversationList';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import ConversationHeader from '../components/chat/ConversationHeader';
import { useAuthStore } from '../store/useAuthStore';

const Chat: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <MainLayout sidebar={<ConversationList />}>
      <div className="flex flex-col h-full">
        <ConversationHeader />
        <MessageList />
        <ChatInput />
      </div>
    </MainLayout>
  );
};

export default Chat;