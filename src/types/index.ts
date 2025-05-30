export interface User {
  id: string;
  username?: string;
  nickname: string; // made optional
  email: string;
  full_name?: string; // made optional
  avatar?: string; 
  role: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export interface Message {
  id: string;
  sender: User;
  conversationId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: MessageType;
  fileUrl?: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
}


export enum MessageType {
  text = "text",
  status = "status",
  code = "code",
  file = "file",
  image ="image"
};

export type ThemeMode = "light" | "dark";
