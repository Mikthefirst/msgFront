import React, { useEffect, useState, useRef } from "react";
import { Message } from "..";
import AvatarWithFallbackProps from "../ui/Avatar";
const server = import.meta.env.VITE_SERVER_URL;
console.log(server); 

interface MessageListProps {
  groupId: string;
}

const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageList: React.FC<MessageListProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${server}/admin/groups/${groupId}/messages`, {
          credentials: "include",
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          There are no messages
        </div>
      ) : (
        messages.map((message, index) => {
          const showAvatar =
            index === 0 || messages[index - 1].sender.id !== message.sender.id;

          return (
            <div key={message.id} className="flex mb-4 justify-start">
              {showAvatar && (
                <div className="mr-2 flex-shrink-0">
                  <AvatarWithFallbackProps
                    src={`${server}/image-service/get-avatar/${message.sender.avatar}`}
                    alt={
                      message.sender.nickname ||
                      message.sender.username ||
                      "failed to load"
                    }
                    size={40}
                  />
                </div>
              )}

              <div className={`max-w-[70%] ${!showAvatar ? "ml-8" : ""}`}>
                <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none break-words">
                  {message.content}
                </div>

                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 justify-start">
                  <span>{formatMessageTime(new Date(message.timestamp))}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
