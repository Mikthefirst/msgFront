import { Group } from '../../types';

// Fetch all conversations for the current user
export const fetchUserGroups = async (): Promise<Group[]> => {
  try {
    const response = await fetch("http://localhost:3000/conversations/for-user", {credentials: 'include'});
    if (!response.ok) {
      return [];
    }
    
    const conversations = await response.json();
    console.log("conversations/for-user: ", conversations);
    return conversations;
    /*return conversations.filter(
      (conversation: Group) => conversation.isGroup === true
    );*/
  } catch (error) {
    console.log('request failed:', error);
    return [];
  }
};

// Check if the current user is an admin of the specified group
export const checkIsAdmin = async (groupId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://localhost:3000/conversations/is-group-admin/${groupId}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      // For demo purposes, return true to show admin features
      return false;
    }
    
    const { isAdmin } = await response.json();
    console.log('isAdmin: ', isAdmin)
    return isAdmin;
  } catch (error) {
    console.log(error);
    return false;
    }
};

export const fetchGroupParticipants = async (groupId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/conversations/groups/${groupId}/participants`,
      { credentials: "include" }
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    console.log("conv participants: ", data);
    return data;
  } catch (error) {
    console.log('Using mock participants as server request failed:', error);
    return [];
  }
};

export const fetchMemberCount = async (conversationId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/conversations/${conversationId}/member-count`,
      {credentials:'include'}
    );
    const count = await response.json();
    return count;
  } catch (error) {
    console.error("Error fetching member count:", error);
    return null;
  }
};