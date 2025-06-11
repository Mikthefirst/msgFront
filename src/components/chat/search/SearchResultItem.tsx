import React from "react";
import AvatarWithFallback from "../../ui/AvatarWithFallback";
const server = import.meta.env.VITE_SERVER_URL;

interface SearchResultItemProps {
  item: any;
  onClick: (item: any) => void;
  term: string;
}

export const SearchResultItem = ({
  item,
  onClick,
  term,
}: SearchResultItemProps) => {
  const highlight = (text: string) => {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <span className="font-semibold bg-yellow-100">
          {text.slice(index, index + term.length)}
        </span>
        {text.slice(index + term.length)}
      </>
    );
  };

  const isGroup = item.group_nickname?.startsWith("$");

  return (
    <li
      onClick={() => onClick(item)}
      className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-3"
    >
      {isGroup && item.groupAvatar && (
        <AvatarWithFallback
          src={`${server}/image-service/get-conversation-avatar/${item.id}`}
          alt={item.groupName}
          size={40}
        />
      )}
      <div>
        <div className="font-medium text-base">
          {highlight(item.nickname || item.group_nickname)}
        </div>
        <div className="text-sm text-gray-600">
          {highlight(item.username || item.groupName)}
        </div>
      </div>
    </li>
  );
};
