// stores/ChatStore.ts
import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import { Message } from "../types";
import ChatService from "../service/ChatService";

export class ChatStore {
  rootStore: RootStore;
  chatService = new ChatService();

  messages: Record<string, Message[]> = {};
  activeConversationId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get activeMessages(): Message[] {
    return this.activeConversationId
      ? this.messages[this.activeConversationId] || []
      : [];
  }

  async setActiveConversation(id: string) {
    this.activeConversationId = id;
    this.isLoading = true;
    try {
      const msgs = await this.chatService.fetchMessages(id);
      this.messages[id] = msgs.map((msg) => ({ ...msg, read: true }));
      this.rootStore.conversationStore.resetUnread(id);
    } catch (e) {
        console.log(e);
    } finally {
      this.isLoading = false;
    }
  }

  async sendMessage(conversationId: string, content: string) {
    try {
      const message = await this.chatService.sendMessage(
        conversationId,
        content
      );
      this.messages[conversationId] = [
        ...(this.messages[conversationId] || []),
        message,
      ];
      this.rootStore.conversationStore.updateLastMessage(
        conversationId,
        message
      );
    } catch (e) {
      console.log(e)
      this.error = String(e)
    }
  }

  async markAsRead(conversationId: string, messageId: string) {
    try {
      await this.chatService.markMessageAsRead(conversationId, messageId);
      this.messages[conversationId] = (this.messages[conversationId] || []).map(
        (msg) => (msg.id === messageId ? { ...msg, read: true } : msg)
      );
    } catch (e) {
      console.log(e);
      this.error = String(e);
    }
  }
}


