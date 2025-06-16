import React, { useState, useEffect, useCallback } from "react";
import GroupsSidebar from "../components/groups/GroupsSidebar";
import GroupInfo from "../components/groups/GroupInfo";
import GroupMembers from "../components/groups/GroupMembers";
import {
  fetchUserGroups,
  checkIsAdmin,
  fetchGroupParticipants,
} from "../store/services/groupsService";
import { Group, GroupParticipant } from "../types";
const server = import.meta.env.VITE_SERVER_URL;


const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
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
  // Загружает список групп и устанавливает первую по умолчанию
  useEffect(() => {
    loadGroups();
  }, []);

  // Функция, которая фактически получает участников для выбранной группы
  const loadParticipants = useCallback(async () => {
    if (!selectedGroup) {
      setParticipants([]);
      return;
    }

    try {
      const groupParticipants = await fetchGroupParticipants(selectedGroup.id);
      setParticipants(groupParticipants);
    } catch (error) {
      console.error("Failed to load participants:", error);
      setParticipants([]);
    }
  }, [selectedGroup]);

  // Проверяем статус администратора и сразу подгружаем участников
  useEffect(() => {
    if (!selectedGroup) return;

    // Проверка, является ли текущий пользователь админом
    const checkAdminStatus = async () => {
      try {
        const adminStatus = await checkIsAdmin(selectedGroup.id);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    loadParticipants();
  }, [selectedGroup, loadParticipants]);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    // participants и isAdmin перезагрузятся автоматически через useEffect
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroup) return;

    try {
      await fetch(`${server}/conversations/groups/${selectedGroup.id}/leave`, {
        method: "DELETE",
        credentials: "include",
      });

      // обновляем список групп
      setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id));

      // выбираем новую выделенную группу
      const remaining = groups.filter((g) => g.id !== selectedGroup.id);
      setSelectedGroup(remaining.length > 0 ? remaining[0] : null);
    } catch (error) {
      console.error("Failed to leave group:", error);
      setGroups((prev) => prev.filter((g) => g.id !== selectedGroup!.id));
      const remaining = groups.filter((g) => g.id !== selectedGroup!.id);
      setSelectedGroup(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!selectedGroup) return;

    try {
      await fetch(
        `${server}/conversations/groups/${selectedGroup.id}/ban/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      // после успешного бана перезагружаем участников
      await loadParticipants();
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  const handleUnBanUser = async (userId: string) => {
    if (!selectedGroup) return;

    try {
      await fetch(
        `${server}/conversations/groups/${selectedGroup.id}/unban/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      // после разбана тоже перезагружаем участников
      await loadParticipants();
    } catch (error) {
      console.error("Failed to unban user:", error);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!selectedGroup) return;

    try {
      await fetch(
        `${server}/conversations/groups/${selectedGroup.id}/make-admin/${userId}`,
        {
          method: "POST", // либо PATCH, в зависимости от вашего контроллера
          credentials: "include",
        }
      );
      // после назначения админом перезагружаем участников, чтобы роль изменилась
      await loadParticipants();
    } catch (error) {
      console.error("Failed to make user admin:", error);
    }
  };

  const handleGroupCreated = () => {
    loadGroups(); // просто повторно загружаем
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <GroupsSidebar
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupSelect={handleGroupSelect}
        loading={loading}
        onGroupCreated={handleGroupCreated}
      />

      {selectedGroup ? (
        <>
          <GroupInfo group={selectedGroup} onLeaveGroup={handleLeaveGroup} />
          <GroupMembers
            participants={participants}
            isAdmin={isAdmin}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnBanUser}
            onMakeAdmin={handleMakeAdmin}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold mb-2">No Group Selected</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a group from the sidebar or create a new group to get
              started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
