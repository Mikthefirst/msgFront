// services/search.service.ts

const server = import.meta.env.VITE_SERVER_URL;


export async function searchRoomsByName(term: string) {
  const response = await fetch(
    `${server}/search/rooms/name?term=${encodeURIComponent(term)}`,
    { credentials: "include" }
  );
  if (!response.ok)
    throw new Error(`Error searching rooms by name: ${response.status}`);
  const data = await response.json();
  console.log(data)
  return data;
}

export async function searchUsers(term: string) {
  const response = await fetch(
    `${server}/search/users?term=${encodeURIComponent(term)}`, {credentials: 'include'}
  );
  if (!response.ok)
    throw new Error(`Error searching users: ${response.status}`);
  const data = await response.json();
  console.log(data);
  return data;
}

export async function search(term: string) {
  if (!term.trim()) return [];

  const trimmed = term.trim();

  if (trimmed.startsWith("@")) {
    return await searchUsers(trimmed);
  }

  if (trimmed.startsWith("$")) {
    const byName = await searchRoomsByName(trimmed);
    return [...byName];
  }

  // fallback: ничего не найдено
  return [];
}

export async function createChat(dto: { user2Id: string }) {
  const response = await fetch(`${server}/conversations/direct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", credentials: 'include'
    },
    
    body: JSON.stringify(dto),
  });

  if (!response.ok) throw new Error("Failed to create chat");

  return response.json();
}


export async function joinGroup(dto: { conversationId: string }) {
  const response = await fetch(`${server}/conversations/join-group`, {
    method: "POST",
    credentials:'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) throw new Error("Failed to join group");

  return await response.json();
}
