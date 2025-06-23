import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import Avatar from "../ui/Avatar";
import { formatMessageTime } from "../../utils/dateUtils";
import { CheckCheck } from "lucide-react";
import { Message } from "../../types";
import { useStore } from "../../store/StoreContext";
import CodeRenderer from "./render/CodeRenderer";
import StatusDisplay from "./render/StatusDisplay";
import FileMessageRenderer from "./render/FileMessageRenderer";
import VoiceMessageRenderer from "./render/VoiceMessageRenderer";

const MessageList: React.FC = observer(() => {
  const { chatStore, userStore } = useStore();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const activeConversationId = chatStore.activeConversationId;
  const conversationMessages: Message[] = chatStore.filteredMessages;

  // Удаляем дубликаты по sender.id + content или sender.id + fileUrl
  const deduplicatedMessages = conversationMessages.filter(
    (message, index, self) => {
      return (
        self.findIndex(
          (m) =>
            m.sender.id === message.sender.id &&
            ((m.content === message.content &&
              m.type !== "file" &&
              m.type !== "image" &&
              m.type !== "voice") ||
              (m.fileUrl && m.fileUrl === message.fileUrl))
        ) === index
      );
    }
  );

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId) return;
    chatStore.fetchMessages();
  }, [activeConversationId]);

  // 🔧 Костыль: принудительный ререндер каждые 2 сек
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((x) => x + 1);
      chatStore.fetchMessages();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length]);

  if (!activeConversationId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">
          Выберите беседу, чтобы начать обмен сообщениями
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto flex-1">
      {deduplicatedMessages.map((message, index) => {
        const isCurrentUser =
          userStore.user &&
          (message.sender.id === userStore.user.id ||
            message.sender.id === "hardcoding");

        const showAvatar =
          !isCurrentUser &&
          (index === 0 ||
            deduplicatedMessages[index - 1].sender.id !== message.sender.id);

        return (
          <div
            key={message.id}
            className={`flex mb-4 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {!isCurrentUser && showAvatar && (
              <div className="mr-2 flex-shrink-0">
                <Avatar
                  src={message.sender.avatar || ""}
                  alt="User"
                  size="sm"
                />
              </div>
            )}

            <div
              className={`max-w-[70%] ${
                !isCurrentUser && !showAvatar ? "ml-8" : ""
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-bl-none"
                }`}
              >
                {message.type === "code" ? (
                  <CodeRenderer content={message.content} />
                ) : message.type === "status" ? (
                  <StatusDisplay statusData={JSON.parse(message.content)} />
                ) : message.type === "file" || message.type === "image" ? (
                  <FileMessageRenderer
                    fileName={message.content}
                    fileUrl={message.fileUrl!}
                    isImage={message.type === "image"}
                  />
                ) : message.type === "voice" && message.fileUrl ? (
                  <VoiceMessageRenderer fileUrl={message.fileUrl} />
                ) : (
                  message.content
                )}
              </div>

              <div
                className={`flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <span>{formatMessageTime(new Date(message.timestamp))}</span>

                {isCurrentUser && (
                  <span className="ml-1">
                    <CheckCheck
                      className={`h-3 w-3 ${
                        message.read ? "text-blue-500" : ""
                      }`}
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
