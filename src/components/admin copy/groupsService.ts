//export const server = "http://localhost:3000";
const server = import.meta.env.VITE_SERVER_URL;
console.log(server); // должно быть http://localhost:3000

export const fetchUserGroups = async () => {
  try {
    const response = await fetch(`${server}/admin/groups`, {credentials: "include"});
    return await response.json();
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

export const checkIsAdmin = async (groupId: string) => {
  try {
    const response = await fetch(`${server}/admin/groups/${groupId}/is-admin`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return true;
  }
};

export const fetchGroupParticipants = async (groupId: string) => {
  try {
    const response = await fetch(
      `${server}/admin/groups/${groupId}/participants`,
      {
        credentials: "include",
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching participants:', error);
  }
};

export const fetchMemberCount = async (groupId: string) => {
  try {
    const response = await fetch(
      `${server}/admin/groups/${groupId}/member-count`,
      {
        credentials: "include",
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching member count:', error);
  }
};

export const fetchMessages = async (groupId: string) => {
  try {
    const response = await fetch(`${server}/admin/groups/${groupId}/messages`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};