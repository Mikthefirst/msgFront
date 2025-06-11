// components/chat/ConversationHeader.tsx
import React, { useState } from "react";
import { useStore } from "../../store/StoreContext";

const ConversationHeader: React.FC = () => {
  const { chatStore } = useStore();
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    chatStore.setSearchQuery(value);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Поиск по сообщениям..."
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
};

export default ConversationHeader;
