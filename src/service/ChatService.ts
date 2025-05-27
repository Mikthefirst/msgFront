// services/ChatService.ts
import { Message } from "../types";

export default class ChatService {
  async fetchMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`http://localhost:3000/messages/${conversationId}`, {credentials:'include'});
    if (!res.ok) throw new Error("Failed to load messages");
    return await res.json();
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const res = await fetch(`/api/messages/${conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
  }

  async markMessageAsRead(
    conversationId: string,
    messageId: string
  ): Promise<void> {
    const res = await fetch(`/api/messages/${conversationId}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    if (!res.ok) throw new Error("Failed to mark message as read");
  }
}
