//MessageList.tsx
import React, { useEffect, useRef } from 'react';
import { observer } from "mobx-react-lite";
import Avatar from '../ui/Avatar';
import { formatMessageTime } from '../../utils/dateUtils';
import { CheckCheck } from 'lucide-react';
import { Message } from '../../types';
import { useStore } from '../../store/StoreContext';

const MessageList: React.FC = observer(() => {
    const { chatStore } = useStore();
  
  const { activeConversationId } = chatStore;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const conversationMessages:Message[] = chatStore.activeMessages;
  
  useEffect(() => {
    if (!chatStore.activeConversationId) return;
    console.log("Новый activeConversationId:", chatStore.activeConversationId);
    chatStore.fetchMessages();
  }, [chatStore.activeConversationId])
  

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);
  
  console.log('activeConversationId:', activeConversationId);
  if (!activeConversationId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4 overflow-y-auto flex-1">
      {conversationMessages.map((message, index) => {
        const isCurrentUser = message.senderId === '1';
        const showAvatar = !isCurrentUser && (index === 0 || conversationMessages[index - 1].senderId !== message.senderId);
        
        return (
          <div
            key={message.id}
            className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUser && showAvatar && (
              <div className="mr-2 flex-shrink-0">
                <Avatar
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="User"
                  size="sm"
                />
              </div>
            )}
            
            <div className={`max-w-[70%] ${!isCurrentUser && !showAvatar ? 'ml-8' : ''}`}>
              <div
                className={`
                  p-3 rounded-lg
                  ${isCurrentUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }
                `}
              >
                {message.content}
              </div>
              
              <div className={`flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <span>{formatMessageTime(new Date(message.timestamp))}</span>
                
                {isCurrentUser && (
                  <span className="ml-1">
                    <CheckCheck 
                      className={`h-3 w-3 ${message.read ? 'text-blue-500' : ''}`}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
});

export default MessageList;