export interface User {
  id: string;
  username?: string;
  nickname?: string; // made optional
  email: string;
  full_name?: string; // made optional
  avatar?: string; 
  role: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export interface User {
  id: string;
  username?: string;
  nickname?: string;
  email: string;
  full_name?: string;
  avatar?: string;
  isBlocked: boolean;
  isAdmin: boolean;
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
  image = "image",
  voice = "voice"
};

export type ThemeMode = "light" | "dark";




/*
avatar: "https://example.com/avatar.jpg"
email: "john@example.com"
full_name: "John Doe"
id: "ddf9cca4-e52a-4f7f-b7f2-5adfec038032"
isAdmin: false
isBlocked: false
joinedAt: "2025-05-30T11:33:47.908Z"
nickname: "john"
role: "user"
username: "johndoe"
*/
export interface GroupParticipant extends User {
  role: "user" | "admin";
  joinedAt?: string;
}

export interface MessagePreview {
  sender: {
    nickname: string;
    id: string;
    username: string;
  };
  text: string;
  timestamp: string;
}

export interface Group {
  id: string;
  groupName: string;
  group_nickname?: string;
  groupAvatar?: string;
  isGroup: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  createdBy?: {
    id: string;
    username: string;
    nickname?: string;
  };
  lastMessage?: MessagePreview;
  unreadCount: number;
  description?: string;
}