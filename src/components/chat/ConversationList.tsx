import React, { useMemo, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/StoreContext";
import { Plus } from "lucide-react";
import { formatDistanceToNow } from "../../utils/dateUtils";
import { Conversation } from "../../types";
import { useNavigate } from "react-router-dom";
import ConversationSearch from "./search/ConversationSearch"; // ⬅️ новый импорт
import AvatarWithFallback from "../ui/AvatarWithFallback";

const ConversationList: React.FC = observer(() => {
  const navigate = useNavigate();
  const { conversationStore } = useStore();
  const { conversations, activeConversationId } = conversationStore;

  const onClickConversation = (id: string) => {
    conversationStore.setActiveConversation(id);
  };

  useEffect(() => {
    conversationStore.fetchConversations();
    conversationStore.conversations = conversationStore.conversations.map(
      (conv) => ({
        ...conv,
        unreadCount: 0,
        isGroup: true,
      })
    );
  }, [conversationStore]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const lower = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) => conv.groupName && conv.groupName.toLowerCase().includes(lower)
    );
  }, [searchQuery, conversations]);

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || "";
      const bTime = b.lastMessage?.timestamp || "";
      return bTime.localeCompare(aTime);
    });
  }, [filteredConversations]);

  return (
    <div className="flex flex-col h-full">
      <ConversationSearch />

      <div className="flex items-center justify-between p-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Messages
        </h2>
        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4" onClick={() => navigate("/group")} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {sortedConversations.map((conversation: Conversation) => {
          const isActive = activeConversationId === conversation.id;
          const displayName = conversation.groupName || "Unnamed Group";

          return (
            <div
              key={conversation.id}
              className={`p-4 flex items-center cursor-pointer border-l-4 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive
                  ? "border-l-blue-500 bg-blue-50 dark:bg-gray-700"
                  : "border-l-transparent"
              }`}
              onClick={() => onClickConversation(conversation.id)}
            >
              <AvatarWithFallback
                src={`http://localhost:3000/image-service/get-conversation-avatar/${conversation.id}`}
                alt={displayName}
                size={40}
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
