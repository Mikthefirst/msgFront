import React, { useEffect, useState } from "react";
import { Clock, FileText, User, Users } from "lucide-react";
import Button from "../ui/Button";
import { Group } from "../index";
import { formatDateNormal } from "../../../utils/dateUtils";
import {
  fetchMemberCount,
  server,
} from "../groupsService";

interface GroupInfoProps {
  group: Group;
  onBanGroup: () => void;
}

const GroupInfo: React.FC<GroupInfoProps> = ({ group, onBanGroup }) => {
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await fetchMemberCount(group.id);
        setMemberCount(count);
      } catch {
        setMemberCount(null);
      }
    };
    fetchCount();
  }, [group.id]);

  return (
    <div className="flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        {/* Avatar + Group Name */}
        <div className="flex flex-col items-center text-center">
          {group.groupAvatar ? (
            <img
              src={`${server}/image-service/get-conversation-avatar/${group.id}`}
              alt={group.groupName}
              className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm">
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <h1 className="text-xl font-bold mt-2">{group.groupName}</h1>
          {group.group_nickname && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              aka {group.group_nickname}
            </p>
          )}
        </div>

        {/* Info Block */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-start">
            <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Created by:{" "}
              </span>
              <span className="font-medium">
                {group.createdBy?.nickname ||
                  group.createdBy?.username ||
                  "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Created:{" "}
              </span>
              <span className="font-medium">
                {formatDateNormal(group.CreatedAt)}
              </span>
            </div>
          </div>

          {group.description && (
            <div className="flex items-start">
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {group.description}
              </p>
            </div>
          )}

          <div className="flex items-start">
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Members:{" "}
              </span>
              <span className="font-medium">
                {memberCount !== null ? memberCount : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Leave Button */}
        <Button
          onClick={onBanGroup}
          variant={group.Banned ? "secondary" : "danger"}
          size="sm"
          className="w-full mt-2"
        >
          {group.Banned ? "Unban Group" : "Ban Group"}
        </Button>
      </div>
    </div>
  );
};

export default GroupInfo;
