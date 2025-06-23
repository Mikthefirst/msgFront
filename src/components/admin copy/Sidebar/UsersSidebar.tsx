import React, { useState } from "react";
import { User, Shield, UserX } from "lucide-react";
import { User as UserType } from "../../../types";

interface UsersSidebarProps {
  users: UserType[];
  selectedUser: UserType | null;
  onUserSelect: (user: UserType) => void;
  loading: boolean;
}

const UsersSidebar: React.FC<UsersSidebarProps> = ({
  users,
  selectedUser,
  onUserSelect,
  loading,
}) => {
  const [sortBlockedFirst, setSortBlockedFirst] = useState(false);

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center">
        <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-500" />
        Пользователи
      </h2>
    </div>
  );

  const renderSortToggle = () => (
    <label className="flex items-center space-x-2 text-sm mb-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={sortBlockedFirst}
        onChange={() => setSortBlockedFirst((prev) => !prev)}
        className="form-checkbox text-blue-600"
      />
      <span className="text-gray-700 dark:text-gray-300">
        Сначала заблокированные
      </span>
    </label>
  );

  const sortedUsers = (() => {
    if (!sortBlockedFirst) return users;
    const blocked = users.filter((u) => u.isBlocked);
    const active = users.filter((u) => !u.isBlocked);
    return [...blocked, ...active];
  })();

  if (loading) {
    return (
      <div className="w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
        {renderHeader()}
        {renderSortToggle()}
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
      {renderSortToggle()}
      {sortedUsers.length === 0 ? (
        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
          <p>No users found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedUsers.map((user) => {
            const isSelected = selectedUser?.id === user.id;
            const isBlocked = user.isBlocked;

            return (
              <div
                key={user.id}
                onClick={() => onUserSelect(user)}
                className={`p-3 rounded-md cursor-pointer transition-all duration-200
                  ${
                    isSelected && isBlocked
                      ? "bg-red-50 dark:bg-red-900/30 border border-red-500"
                      : isSelected
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.nickname || user.username}
                        className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    {isBlocked && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span
                        className={`font-medium text-sm ${
                          isBlocked ? "text-red-500" : ""
                        }`}
                      >
                        {user.nickname || user.username}
                      </span>
                      {user.isAdmin && (
                        <Shield className="h-4 w-4 ml-1 text-blue-500" />
                      )}
                      {isBlocked && (
                        <UserX className="h-4 w-4 ml-1 text-red-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UsersSidebar;
