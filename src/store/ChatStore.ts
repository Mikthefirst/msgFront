// stores/ChatStore.ts
import { makeAutoObservable, observable, toJS } from "mobx";
import { RootStore } from "./RootStore";
import { Message, MessageType,  } from "../types";
import ChatService from "./services/ChatService";
export class ChatStore {
  rootStore: RootStore;
  chatService: ChatService;
  messages = observable.map<string, Message[]>();
  activeConversationId: string | null = null;
  searchQuery = "";
  isLoading = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.chatService = new ChatService();
    makeAutoObservable(this);
  }

  get activeMessages() {
    return this.activeConversationId
      ? this.messages.get(this.activeConversationId) || []
      : [];
  }

  async setActiveConversation(id: string) {
    this.activeConversationId = id;
  }

  async fetchMessages() {
    this.isLoading = true;

    if (!this.activeConversationId) {
      console.log("empty conv_id field");
      this.isLoading = false;
      return;
    }

    try {
      const msgs = await this.chatService.fetchMessages(
        this.activeConversationId
      );
      const enriched = msgs.map((msg) => ({ ...msg, read: true }));
      this.messages.set(this.activeConversationId, enriched);

      // Обновляем conversationStore
      this.rootStore.conversationStore.resetUnread(this.activeConversationId);
      if (enriched.length > 0) {
        this.rootStore.conversationStore.updateLastMessage(
          this.activeConversationId,
          enriched[enriched.length - 1]
        );
      }
    } catch (e) {
      console.log(e);
      this.error = String(e);
    } finally {
      this.isLoading = false;
    }
  }

  sendStatus = async (
    conversationId: string,
    statusData: Record<string, string>
  ) => {
    await this.chatService.sendMessageSTATUS(conversationId, statusData);
    this.fetchMessages();
  };
  sendMessage = async (
    conversationId: string,
    content: string,
    type = "text"
  ) => {
    try {
      console.log("chat Store:", conversationId, "\n", content, "\n", type);
      if (type === "text") {
        await this.chatService.sendMessageTEXT(conversationId, content);
      } else if (type === MessageType.code) {
        await this.chatService.sendMessageCODE(conversationId, content);
      }
    } catch (e) {
      console.log(e);
      this.error = String(e);
    }
  };
  sendFile = async (
    conversationId: string,
    file: File,
    name: string,
    type: MessageType
  ) => {
    await this.chatService.sendFileMessage(conversationId, file, name, type);
  };

  async markAsRead(conversationId: string, messageId: string) {
    try {
      await this.chatService.markMessageAsRead(conversationId, messageId);
    } catch (e) {
      console.log(e);
      this.error = String(e);
    }
  }

  handleIncomingMessage = (message: Message) => {
    console.log("handle new msg", message);
    const convId = message.conversationId;
    const current = this.messages.get(convId) || [];

    // ✅ Используем .set с новым массивом
    this.messages.set(convId, [...current, message]);

    if (convId === this.activeConversationId) {
      this.rootStore.conversationStore.updateLastMessage(convId, message);
    }
  };

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  get filteredMessages(): Message[] {
    const messages = this.activeConversationId
      ? toJS(this.messages.get(this.activeConversationId)) || []
      : [];

    if (this.searchQuery.trim()) {
      return messages.filter((msg:Message) =>
        msg.content.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return messages;
  }
}
