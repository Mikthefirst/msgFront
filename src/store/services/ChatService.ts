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
      console.log("send-msg-text");
      webSocketManager.sendMessage("send-message", {
        conversationId,
        content,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendMessageCODE(conversationId: string, content: string) {
    try {
      console.log("send-msg-code");
      webSocketManager.sendMessage("send-message-code", {
        conversationId,
        content,
      });
    } catch (e) {
      console.log(e);
    }
  }
  async sendMessageSTATUS(
    conversationId: string,
    statusData: Record<string, string>
  ) {
    try {
      console.log("send-msg-status");
      const content = JSON.stringify(statusData);
      webSocketManager.sendMessage("send-message-status", {
        conversationId,
        content,
      });
    } catch (e) {
      console.error(e);
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



      /*this.activeMessages.push({
        id: this.rootStore.userStore.user?.id || "hardcoding",
        content,
        sender: this.rootStore.userStore.user!,
        timestamp: new Date().toISOString(),
        read: false,
        conversationId: conversationId,
        type: MessageType.text
      });*/
