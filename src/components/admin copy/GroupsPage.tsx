import React, { useState, useEffect } from "react";
import GroupsSidebar from "./Sidebar/GroupsSidebar";
import GroupInfo from "./InfoPanels/GroupInfo";
import { Users, MessageSquare } from "lucide-react";
import {
  fetchUserGroups,
  checkIsAdmin,
  fetchGroupParticipants,
} from "./groupsService";
import { Group, GroupParticipant } from "./index";
import MessageList from "./Chat/MessageList";
const server = import.meta.env.VITE_SERVER_URL;
console.log(server); 

const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const userGroups = await fetchUserGroups();
        setGroups(userGroups);
        if (userGroups.length > 0) {
          setSelectedGroup(userGroups[0]);
        }
      } catch (error) {
        console.error("Failed to load groups:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;

    const loadData = async () => {
      try {
        const [adminStatus, groupParticipants] = await Promise.all([
          checkIsAdmin(selectedGroup.id),
          fetchGroupParticipants(selectedGroup.id),
        ]);
        setIsAdmin(adminStatus);
        setParticipants(groupParticipants);
      } catch (error) {
        console.error("Failed to load group data:", error);
      }
    };

    loadData();
  }, [selectedGroup]);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleToggleBanGroup = async () => {
    if (!selectedGroup) return;
    try {
      const endpoint = selectedGroup.Banned ? "unban" : "ban";
      const res = await fetch(
        `${server}/admin/groups/${selectedGroup.id}/${endpoint}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to toggle ban");

      // Обновляем группы
      const updated = groups.map((g) =>
        g.id === selectedGroup.id ? { ...g, Banned: !g.Banned } : g
      );
      setGroups(updated);
      setSelectedGroup({ ...selectedGroup, Banned: !selectedGroup.Banned });
    } catch (error) {
      console.error("Failed to toggle ban:", error);
    }
  };
  

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <GroupsSidebar
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupSelect={handleGroupSelect}
        loading={loading}
      />
      {selectedGroup ? (
        <div className="flex flex-1 overflow-hidden">
          {/* === LEFT PANEL === */}
          <div className="w-[28rem] flex flex-col border-r border-gray-300 dark:border-gray-700">
            {/* Header */}
            <div className="sticky top-0 z-10 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Информация о группе
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Информация о группе
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <GroupInfo
                group={selectedGroup}
                onBanGroup={handleToggleBanGroup}
              />
            </div>
          </div>

          {/* === RIGHT PANEL === */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Сообщения
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Групповой чат
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <MessageList groupId={selectedGroup.id} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="text-center p-6">
            <h2 className="text-xl font-semibold mb-2">No Group Selected</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a group from the sidebar or create a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
