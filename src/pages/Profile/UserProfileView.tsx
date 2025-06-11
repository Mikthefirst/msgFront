import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserCard from "../../components/profile/UserCard";
import ChatList from "../../components/profile/ChatList";
const server = import.meta.env.VITE_SERVER_URL;

interface UserDto {
  id: string;
  username: string;
  nickname: string;
  email: string;
  full_name?: string;
  avatar?: string;
  CreatedAt: string;
  UpdatedAt?: string;
}

interface Chat {
  id: string;
  title: string;
}

const UserProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    fetch(`${server}/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(console.error);

    fetch(`${server}/conversations/common/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setChats(data))
      .catch(console.error);
  }, [id]);

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate("/chat")}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ← Назад к чатам
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border p-6">
          <UserCard user={user} />
          <ChatList chats={chats} />
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
