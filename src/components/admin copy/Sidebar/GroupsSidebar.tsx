import React, {  } from "react";
import { Users } from "lucide-react";
import { Group } from "../index";
const server = import.meta.env.VITE_SERVER_URL;

interface GroupsSidebarProps {
  groups: Group[];
  selectedGroup: Group | null;
  onGroupSelect: (group: Group) => void;
  loading: boolean;
}

const GroupsSidebar: React.FC<GroupsSidebarProps> = ({
  groups,
  selectedGroup,
  onGroupSelect,
  loading,
}) => {
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center">
        <Users className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-500" />
        Группы
      </h2>
    </div>
  );

  if (loading) {
    return (
      <div className="w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
        {renderHeader()}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      {renderHeader()}
      {groups.length === 0 ? (
        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
          <p>Групп нет</p>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => onGroupSelect(group)}
              className={`p-3 rounded-md cursor-pointer transition-all duration-200
      ${selectedGroup?.id === group.id ? "bg-blue-100 dark:bg-blue-900/30" : ""}
      ${
        group.Banned
          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }
    `}
            >
              <div className="flex items-center">
                <div className="relative">
                  {group.groupAvatar ? (
                    <img
                      src={`${server}/image-service/get-conversation-avatar/${group.id}`}
                      alt={group.groupName}
                      className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="font-medium text-sm">{group.groupName}</div>
                  {group.lastMessage && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      <span className="font-medium">
                        {typeof group.lastMessage.sender === "string"
                          ? group.lastMessage.sender
                          : group.lastMessage.sender?.nickname ??
                            group.lastMessage.sender?.username}
                        :
                      </span>{" "}
                      {group.lastMessage.text}
                    </div>
                  )}
                </div>
                {group.unreadCount > 0 && (
                  <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {group.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsSidebar;
