import React from 'react';
import { useChatStore } from '../../store/useChatStore';
import Avatar from '../ui/Avatar';
import { PhoneCall, Video, MoreVertical } from 'lucide-react';

const ConversationHeader: React.FC = () => {
  const { activeConversationId, conversations } = useChatStore();
  
  // Find the active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  
  if (!activeConversation) return null;
  
  const isGroup = activeConversation.isGroup;
  
  const displayName = isGroup 
    ? activeConversation.groupName 
    : activeConversation.participants.find(p => p.id !== '1')?.name || 'Unknown';
    
  const avatar = isGroup
    ? activeConversation.groupAvatar
    : activeConversation.participants.find(p => p.id !== '1')?.avatar;
    
  const isOnline = isGroup
    ? false
    : activeConversation.participants.find(p => p.id !== '1')?.isOnline || false;
    
  const status = isGroup 
    ? `${activeConversation.participants.length} members` 
    : isOnline ? 'Online' : 'Offline';
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
      <Avatar
        src={avatar || ''}
        alt={displayName}
        size="md"
        status={isOnline ? 'online' : undefined}
      />
      
      <div className="ml-3 flex-1">
        <h2 className="font-medium text-gray-900 dark:text-white">{displayName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
      </div>
      
      <div className="flex items-center">
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mx-1">
          <PhoneCall className="h-5 w-5" />
        </button>
        
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mx-1">
          <Video className="h-5 w-5" />
        </button>
        
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mx-1">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;