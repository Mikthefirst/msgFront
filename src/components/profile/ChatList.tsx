import React from "react";

interface Chat {
  id: string;
  title: string;
}

const ChatList: React.FC<{ chats: Chat[] }> = ({ chats }) => (
  <div>
    <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
      Общие чаты
    </h4>
    {chats.length > 0 ? (
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg"
          >
            {chat.title}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">Нет общих чатов</p>
    )}
  </div>
);

export default ChatList;
