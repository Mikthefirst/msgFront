import React, { useState, useEffect } from 'react';
import UsersSidebar from './Sidebar/UsersSidebar';
import UserInfo from './InfoPanels/UserInfo';
import { User } from '../../types';
const server = import.meta.env.VITE_SERVER_URL;
console.log(server); 

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${server}/admin/users`, {credentials:'include'});
        const data = await response.json();
        setUsers(data);
        if (data.length > 0) {
          setSelectedUser(data[0]);
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      await fetch(`${server}/admin/user/ban/${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, isBlocked: true, banReason: reason }
            : user
        )
      );

      if (selectedUser?.id === userId) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isBlocked: true, banReason: reason } : null
        );
      }
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };
  
  

  const handleUnbanUser = async (userId: string) => {
    try {
      await fetch(`/admin/user/unban/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      
      // Update user in the list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBlocked: false } : user
      ));
      
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, isBlocked: false } : null);
      }
    } catch (error) {
      console.error('Failed to unban user:', error);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      await fetch(`/admin/user/make-admin/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      
      // Update user in the list
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: true } : user
      ));
      
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, isAdmin: true } : null);
      }
    } catch (error) {
      console.error('Failed to make user admin:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      <UsersSidebar
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        loading={loading}
      />

      {selectedUser ? (
        <UserInfo
          user={selectedUser}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
          onMakeAdmin={handleMakeAdmin}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold mb-2">No User Selected</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a user from the sidebar to view their details
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;