import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarWithFallback from "../ui/AvatarWithFallback";

interface ConversationHeaderProps {
  groupName: string;
  avatarUrl?: string;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/group");
  };

  return (
   <div></div>
  );
};

export default ConversationHeader;
/*
 <div
      onClick={handleClick}
      className="flex items-center gap-3 cursor-pointer p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      aria-label={`Перейти к группе ${groupName}`}
    >
      <AvatarWithFallback src={avatarUrl} alt={groupName} size={40} />

      <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
        {groupName}
      </h1>
    </div> */