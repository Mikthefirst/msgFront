import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  AtSign,
  Upload,
  Save,
  Lock,
  Shield,
  UserCircle,
  AtSign as NicknameIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const UserProfile: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDto | null>(null);
  const [form, setForm] = useState({
    username: "",
    nickname: "",
    full_name: "",
    email: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`${server}/users/get-user`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Не удалось получить данные");
        return res.json();
      })
      .then((data: UserDto) => {
        setUser(data);
        setForm({
          username: data.username || "",
          nickname: data.nickname || "",
          full_name: data.full_name || "",
          email: data.email || "",
        });
      })
      .catch(console.error);
  }, []);

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch(`${server}/users/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Ошибка обновления профиля");
    } catch {
      alert("Не удалось сохранить изменения");
      return;
    }

    if (avatarFile) {
      const data = new FormData();
      data.append("file", avatarFile);
      try {
        const res = await fetch(`${server}/image-service/upload-avatar`, {
          method: "POST",
          credentials: "include",
          body: data,
        });
        if (!res.ok) throw new Error("Ошибка загрузки аватара");
      } catch {
        alert("Не удалось загрузить аватар");
        return;
      }
    }

    fetch(`${server}/users/get-user`, { credentials: "include" })
      .then((res) => res.json())
      .then((data: UserDto) => {
        setUser(data);
        setForm({
          username: data.username || "",
          nickname: data.nickname || "",
          full_name: data.full_name || "",
          email: data.email || "",
        });
        setAvatarFile(null);
        alert("Профиль обновлён");
      })
      .catch(console.error);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-300 dark:bg-blue-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-blue-300 dark:bg-blue-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-blue-300 dark:bg-blue-700 rounded col-span-2"></div>
                <div className="h-2 bg-blue-300 dark:bg-blue-700 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate("/chat")}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ← Вернуться в чат
          </button>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative group">
                  {user.avatar ? (
                    <img
                      src={`${server}/image-service/get-avatar`}
                      alt={user.full_name || user.username}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-600/20 dark:to-indigo-600/20 flex items-center justify-center ring-4 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all duration-300">
                      <UserIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 cursor-pointer bg-blue-500 rounded-full p-1.5 hover:bg-blue-600 transition-colors">
                    <Upload className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.full_name || user.username}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400">
                    @{user.nickname}
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="grid grid-cols-2 gap-4"
              >
                <Field
                  label="Username"
                  Icon={UserCircle}
                  name="username"
                  value={form.username}
                  onChange={onProfileChange}
                  type="text"
                />
                <Field
                  label="Nickname"
                  Icon={NicknameIcon}
                  name="nickname"
                  value={form.nickname}
                  onChange={onProfileChange}
                  type="text"
                />
                <Field
                  label="Full Name"
                  Icon={UserIcon}
                  name="full_name"
                  value={form.full_name}
                  onChange={onProfileChange}
                  type="text"
                />
                <Field
                  label="Email"
                  Icon={AtSign}
                  name="email"
                  value={form.email}
                  onChange={onProfileChange}
                  type="email"
                />

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Security
                </h3>
              </div>
              <PasswordSection userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  Icon,
  name,
  value,
  onChange,
  type,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
      <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
    />
  </div>
);

const PasswordSection: React.FC<{ userId: string }> = ({ userId }) => {
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onPwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${server}/users/change-password/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      if (!res.ok) throw new Error("Password change failed");
      alert("Password changed successfully");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      alert("Error changing password");
    }
  };

  return (
    <form onSubmit={onPwSubmit} className="space-y-4">
      <Field
        label="Current Password"
        Icon={Lock}
        name="currentPassword"
        value={pwForm.currentPassword}
        onChange={onPwChange}
        type="password"
      />
      <Field
        label="New Password"
        Icon={Lock}
        name="newPassword"
        value={pwForm.newPassword}
        onChange={onPwChange}
        type="password"
      />
      <Field
        label="Confirm Password"
        Icon={Lock}
        name="confirmPassword"
        value={pwForm.confirmPassword}
        onChange={onPwChange}
        type="password"
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Save className="h-5 w-5" />
        <span>Change Password</span>
      </button>
    </form>
  );
};

export default UserProfile;
