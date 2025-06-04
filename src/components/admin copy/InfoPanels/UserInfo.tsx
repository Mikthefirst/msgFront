import React, { useState } from 'react';
import { User as UserIcon, Mail, Calendar, Shield, Ban } from 'lucide-react';
import Button from '../ui/Button';
import { User } from '../index';
import { formatDateNormal } from '../../../utils/dateUtils';
import BanReasonModal from './BanReasonModal'; // путь к попапу

interface UserInfoProps {
  user: User;
  onBanUser: (userId: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onMakeAdmin: (userId: string) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  onBanUser,
  onUnbanUser,
  onMakeAdmin,
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleBanClick = () => setIsModalOpen(true);
    const handleBanSubmit = async (reason: string) => {
      await onBanUser(user.id, reason);
      setIsModalOpen(false);
    };
  
  return (
    <div className="flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.nickname || user.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-md mb-4">
              <UserIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          )}

          <h1 className="text-2xl font-bold">
            {user.nickname || user.username}
            {user.isAdmin && (
              <Shield className="inline-block h-6 w-6 ml-2 text-blue-500" />
            )}
          </h1>
          {user.isBlocked && (
            <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              <Ban className="h-4 w-4 mr-1" />
              Banned
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-3">
              User Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-start">
                <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.username}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              {user.createdAt && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDateNormal(user.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {user.banReason && (
                <div className="flex items-start">
                  <Ban className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      Ban Reason
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {user.banReason}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {!user.isAdmin && (
              <Button
                onClick={() => onMakeAdmin(user.id)}
                variant="secondary"
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Make Admin
              </Button>
            )}

            {user.isBlocked ? (
              <Button
                onClick={() => onUnbanUser(user.id)}
                className="w-full"
              >
                Unban User
              </Button>
            ) : (
              <Button
                onClick={handleBanClick}
                variant="danger"
                className="w-full"
              >
                Ban User
              </Button>
            )}
          </div>
          <BanReasonModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleBanSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;