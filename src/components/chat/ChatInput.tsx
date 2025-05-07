import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { Smile, Paperclip, Send } from 'lucide-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { activeConversationId, sendMessage } = useChatStore();
  
  const handleSendMessage = () => {
    if (!message.trim() || !activeConversationId) return;
    
    sendMessage(activeConversationId, message);
    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!activeConversationId) return null;
  
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-end">
        <button 
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Add emoji"
        >
          <Smile className="h-5 w-5" />
        </button>
        
        <button 
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
        <div className="flex-1 mx-2">
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Type a message..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <button
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendMessage}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;