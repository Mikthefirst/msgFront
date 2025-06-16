import React, { useEffect, useState } from "react";

const server = import.meta.env.VITE_SERVER_URL;
console.log(server); 
interface UserOption {
  id: string;
  username: string;
  nickname?: string;
}

interface Props {
  onClose: () => void;
  onGroupCreated: () => void;
}

const CreateGroupModal: React.FC<Props> = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [groupNickname, setGroupNickname] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Загрузка списка пользователей для чекбоксов
    fetch(`${server}/conversations/direct-users`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Failed to load users", err));
  }, []);

  const toggleUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Используем FormData вместо JSON
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("groupNickname", groupNickname);
    formData.append("description", groupDescription);
    if (avatarFile) {
      formData.append("file", avatarFile); // ключ "avatar" должен совпадать с тем, что принимает FileInterceptor
    }
    // participantIds[] — сериализуем массив, например, как JSON-строку или как несколько значений
    selectedIds.forEach((id) => formData.append("participantIds[]", id));

    try {
      const res = await fetch(`${server}/conversations/create-group`, {
        method: "POST",
        credentials: "include",
        body: formData, // НЕ устанавливаем заголовок Content-Type — браузер сделает это сам
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to create group: " + text);
      }
      onClose();
      onGroupCreated(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Create Group</h3>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800"
        />

        <input
          type="text"
          placeholder="Group Nickname"
          value={groupNickname}
          onChange={(e) => setGroupNickname(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800"
        />

        <input
          type="text"
          placeholder="Group Description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          className="w-full mb-2 p-2 border rounded text-black dark:text-white bg-white dark:bg-gray-800"
        />

        <label className="block mb-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Group Avatar (optional)
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 dark:bg-gray-800"
          />
        </label>

        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Add participants:</p>
          <div className="space-y-1 max-h-40 overflow-y-auto border rounded p-2">
            {users.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
                <span>{user.nickname || user.username}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!groupName || !groupNickname}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
