import React from "react";
import { User as UserIcon } from "lucide-react";
const server = import.meta.env.VITE_SERVER_URL;

interface UserDto {
  id: string;
  username: string;
  nickname: string;
  email: string;
  full_name?: string;
  avatar?: string;
}

const UserCard: React.FC<{ user: UserDto }> = ({ user }) => (
  <div className="flex items-center space-x-6 mb-6">
    {user.avatar ? (
      <img
        src={`${server}/image-service/get-avatar`}
        alt={user.full_name || user.username}
        className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/30"
      />
    ) : (
      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center ring-4 ring-blue-500/30">
        <UserIcon className="h-10 w-10 text-white" />
      </div>
    )}

    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {user.full_name || user.username}
      </h3>
      <p className="text-blue-600 dark:text-blue-400">@{user.nickname}</p>
      <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
    </div>
  </div>
);

export default UserCard;
