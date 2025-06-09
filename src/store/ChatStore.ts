// stores/ChatStore.ts
import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import { Message, MessageType,  } from "../types";
import ChatService from "./services/ChatService";
export class ChatStore {
  rootStore: RootStore;
  chatService: ChatService;
  messages: Record<string, Message[]> = {};
  activeConversationId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.chatService = new ChatService(this.rootStore.server);
    makeAutoObservable(this);
  }

  get activeMessages(): Message[] {
    return this.activeConversationId
      ? this.messages[this.activeConversationId] || []
      : [];
  }

  async setActiveConversation(id: string) {
    this.activeConversationId = id;
  }

  async fetchMessages() {
    this.isLoading = true;
    if (this.activeConversationId) {
      try {
        const msgs = await this.chatService.fetchMessages(
          this.activeConversationId
        );
        this.messages[this.activeConversationId] = msgs.map((msg) => ({
          ...msg,
          read: true,
        }));
        this.rootStore.conversationStore.resetUnread(this.activeConversationId);
        this.rootStore.conversationStore.updateLastMessage(
          this.activeConversationId,
          this.messages[this.activeConversationId][
            this.messages[this.activeConversationId].length - 1
          ]
        );
      } catch (e) {
        console.log(e);
        this.error = String(e);
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log("empty conv_id field");
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

      this.fetchMessages();
      // УБРАНО: локальное добавление сообщения
      // Оно теперь будет приходить через WebSocket ("new-message")
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
      this.messages[conversationId] = (this.messages[conversationId] || []).map(
        (msg) => (msg.id === messageId ? { ...msg, read: true } : msg)
      );
    } catch (e) {
      console.log(e);
      this.error = String(e);
    }
  }

  handleIncomingMessage = (message: Message) => {
    const { conversationId } = message;

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }

    this.messages[conversationId].push(message);

    if (conversationId === this.activeConversationId) {
      this.rootStore.conversationStore.resetUnread(conversationId);
      this.rootStore.conversationStore.updateLastMessage(
        conversationId,
        message
      );
    }
  };
}
