import React, { useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ConversationList from '../components/chat/ConversationList';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import ConversationHeader from '../components/chat/ConversationHeader';

const Chat: React.FC = () => {

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