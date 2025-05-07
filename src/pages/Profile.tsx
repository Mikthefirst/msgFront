import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ConversationList from "../components/chat/ConversationList";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import { User, Mail, Camera, LogOut } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  email: string;
  full_name: string;
  avatar: string;
  role: string;
  CreatedAt: string;
  UpdatedAt: string;
  status?: string; // Optional field
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/profile");
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data);
        setName(data.full_name || "");
        setUsername(data.username || "");
        setStatus(data.status || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  /*  try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          username,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setUser(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Profile update error:", err);
    }*/
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <MainLayout sidebar={<ConversationList />}>
        <div className="max-w-2xl mx-auto p-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-24 w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout sidebar={<ConversationList />}>
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md">
            {error}
          </div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout sidebar={<ConversationList />}>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Profile
        </h1>

        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <Avatar
              src={user.avatar}
              alt={user.full_name}
              size="xl"
              status="online"
            />

            <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {!isEditing && (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.full_name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                @{user.username}
              </p>
              {user.status && (
                <p className="text-gray-500 dark:text-gray-500 mt-2 italic">
                  "{user.status}"
                </p>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />

            <Input
              label="Username"
              type="text"
              placeholder="Your username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Status"
              type="text"
              placeholder="Set a status message"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />

            <div className="flex space-x-4 mt-6">
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <Button
              onClick={() => setIsEditing(true)}
              fullWidth
              className="mb-4"
            >
              Edit Profile
            </Button>

            <Button
              onClick={handleLogout}
              fullWidth
              variant="outline"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
