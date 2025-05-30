import React from "react";
import { User, UserX, Shield } from "lucide-react";
import Button from "../ui/Button";
import { GroupParticipant } from "../../types";

interface GroupMembersProps {
  participants: GroupParticipant[];
  isAdmin: boolean;
  onBanUser: (userId: string) => void;
  onUnbanUser: (userId: string) => void;
  onMakeAdmin: (userId: string) => void;
}

const GroupMembers: React.FC<GroupMembersProps> = ({
  participants,
  isAdmin,
  onBanUser,
  onUnbanUser,
  onMakeAdmin,
}) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-500" />
        Members
      </h2>

      {participants.length === 0 ? (
        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
          <p>No members found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={`
                p-3 border border-gray-200 dark:border-gray-700 rounded-md
                ${
                  participant.isBlocked
                    ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                    : ""
                }
              `}
            >
              <div className="flex items-center mb-2">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.nickname || participant.username}
                    className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}

                <div className="ml-3 flex-1">
                  <div className="font-medium flex items-center">
                    {participant.nickname || participant.username}
                    {participant.role === "admin" && (
                      <Shield className="h-4 w-4 ml-1 text-blue-600 dark:text-blue-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {participant.email}
                  </div>
                </div>
              </div>

              {isAdmin && participant.role !== "admin" && (
                <div className="flex space-x-2 mt-2">
                  {participant.isBlocked ? (
                    <Button
                      onClick={() => onUnbanUser(participant.id)}
                      size="sm"
                      className="flex-1"
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Unban
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onBanUser(participant.id)}
                      variant="danger"
                      size="sm"
                      className="flex-1"
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Ban
                    </Button>
                  )}

                  {!participant.isBlocked && (
                    <Button
                      onClick={() => onMakeAdmin(participant.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Make Admin
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupMembers;
