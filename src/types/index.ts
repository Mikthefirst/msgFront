export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

export interface Conversation {
  id: string;
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export type ThemeMode = 'light' | 'dark';