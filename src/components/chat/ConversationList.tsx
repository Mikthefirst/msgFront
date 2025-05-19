import React, { useMemo, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/StoreContext";
import { Search, Plus } from "lucide-react";
import Avatar from "../ui/Avatar";
import { formatDistanceToNow } from "../../utils/dateUtils";
import { Conversation } from "../../types";

const ConversationList: React.FC = observer(() => {
  const { conversationStore } = useStore();

  const { conversations, activeConversationId, setActiveConversation } =
    conversationStore;

    useEffect(() => {
       conversationStore.fetchConversations();
       conversationStore.conversations = conversationStore.conversations.map(
         (conv) => ({
           ...conv,
           participants: [], // заглушка
           unreadCount: 0,
           isGroup: true, // если все группы
         })
       );
      
      console.log(conversationStore);
    }, [conversationStore]);
  
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const lower = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      if (conv.isGroup && conv.groupName) {
        return conv.groupName.toLowerCase().includes(lower);
      }
      if (!Array.isArray(conv.participants)) return false;

      return conv.participants.some(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.username.toLowerCase().includes(lower)
      );
    });
  }, [searchQuery, conversations]);

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || "";
      const bTime = b.lastMessage?.timestamp || "";
      return bTime.localeCompare(aTime);
    });
  }, [filteredConversations]);

  const getDisplayName = (conversation: (typeof conversations)[0]) => {
    if (conversation.isGroup) return conversation.groupName||false;
    const other = conversation.participants.find((p) => p.id !== "1");
    return other?.name || "Unknown";
  };

  const getAvatar = (conversation: (typeof conversations)[0]) => {
    if (conversation.isGroup) return conversation.groupAvatar || false;
    const other = conversation.participants.find((p) => p.id !== "1");
    return other?.avatar;
  };

  const getIsOnline = (conversation: (typeof conversations)[0]) => {
    if (conversation.isGroup) return false;
    const other = conversation.participants.find((p) => p.id !== "1");
    return other?.isOnline || false;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Messages
        </h2>
        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {sortedConversations.map((conversation: Conversation) => {
          const isActive = activeConversationId === conversation.id;
          const displayName = getDisplayName(conversation);
          const avatar = getAvatar(conversation);
          const isOnline = getIsOnline(conversation);

          return (
            <div
              key={conversation.id}
              className={`
                p-4 flex items-center cursor-pointer border-l-4 hover:bg-gray-100 dark:hover:bg-gray-700
                ${
                  isActive
                    ? "border-l-blue-500 bg-blue-50 dark:bg-gray-700"
                    : "border-l-transparent"
                }
              `}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <Avatar
                src={avatar || ""}
                alt={displayName || "Conversation"}
                size="md"
                status={isOnline ? "online" : "away"}
              />

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {displayName}
                  </h3>

                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(
                        new Date(conversation.lastMessage.timestamp)
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>

                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ConversationList;
