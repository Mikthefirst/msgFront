import React, { useEffect, useState } from 'react';
import { Clock, FileText, User, Users } from 'lucide-react';
import Button from '../ui/Button';
import { Group } from '../../types';
import { formatDateNormal } from "../../utils/dateUtils";
import { fetchMemberCount } from '../../store/services/groupsService';



const server = import.meta.env.VITE_SERVER_URL;

interface GroupInfoProps {
  group: Group;
  onLeaveGroup: () => void;
}

const GroupInfo: React.FC<GroupInfoProps> = ({ group, onLeaveGroup }) => {
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await fetchMemberCount(group.id);
        console.log(count)
        setMemberCount(count);
      } catch (error) {
        console.log(error)
        setMemberCount(null);
      }
    };
    fetchCount();
  }, []);



  return (
    <div className="flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-lg mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          {group.groupAvatar ? (
            <img
              src={`${server}/image-service/get-conversation-avatar/${group.id}`}
              alt={group.groupName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-md mb-4">
              <Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          )}

          <h1 className="text-2xl font-bold">{group.groupName}</h1>
          {group.group_nickname && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              aka {group.group_nickname}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-3">
              Group Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium">Created by</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {group.createdBy?.nickname ||
                      group.createdBy?.username ||
                      "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium">Created at</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatDateNormal(group.CreatedAt)}
                  </p>
                </div>
              </div>

              {group.description && (
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {group.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium">Members</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {memberCount !== null
                      ? `${memberCount} members`
                      : "Unknown"}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={onLeaveGroup} variant="danger" className="w-full">
              Leave Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;