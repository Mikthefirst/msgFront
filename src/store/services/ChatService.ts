// services/ChatService.ts
import { Message } from "../../types";
import webSocketManager from "../../ws/WebSocketManager";

export default class ChatService {
  async fetchMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(
      `http://localhost:3000/messages/${conversationId}`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error("Failed to load messages");
    return await res.json();
  }

  async sendMessageTEXT(conversationId: string, content: string) {
    try {
      /*      const arr = document.cookie.split(";").map((c) => c.trim());
        let userId = "";
      if (arr && Array.isArray(arr))
        userId = arr.find((c) => c.startsWith("id=")).split("=")[1];
            // Пока сервер не вернул сообщение, можно добавить временное локальное сообщение
      const tempMessage: Message = {
        id: Date.now().toString(), // временный id
        senderId: userId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        conversationId,
        type: "text",
      };
      */
      console.log('send-msg-text')
      webSocketManager.sendMessage("send-message", {
        conversationId,
        content,
      });

    } catch (e) {
      console.log(e);
    }
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
