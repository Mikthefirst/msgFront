// stores/ConversationStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { Conversation, Message } from "../types";
import ConversationService from "../service/ConversationService";
import webSocketManager from "../ws/WebSocketManager";


export class ConversationStore {
  rootStore: RootStore;
  conversationService = new ConversationService();

  conversations: Conversation[] = [];
  activeConversationId: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    //fixThat
    webSocketManager.connect("http://localhost:3000");
    //webSocketManager.connect("wss://your-websocket-server-url");

    webSocketManager.onMessage((data) => {
      if (data.action === "new-message") {
        this.handleIncomingMessage(data.message);
      }
    });
  }

  async fetchConversations() {
    try {
      const data = await this.conversationService.fetchConversations();
      console.log(data);
      runInAction(() => {
        this.conversations = data;
      });
    } catch (e) {
      console.log(e);
    }
  }

  // Метод, который явно отправляет событие 'join-room' на сервер
  joinRoom(conversationId: string) {
    webSocketManager.joinRoom(conversationId);
  }

  setActiveConversation(id: string) {
    console.log("before convID:", id);

    if (
      this.activeConversationId !== undefined &&
      this.activeConversationId !== null
    ) {
      webSocketManager.leaveRoom(this.activeConversationId);
    }

    this.activeConversationId = id;
    this.rootStore.chatStore.setActiveConversation(this.activeConversationId);
    console.log("after convID:", this.activeConversationId);
    this.joinRoom(this.activeConversationId);

    this.resetUnread(this.activeConversationId);
  }

  handleIncomingMessage(message: Message) {
    const { conversationId } = message;
    runInAction(() => {
      this.updateLastMessage(conversationId, message);
      if (conversationId === this.activeConversationId) {
        // optionally notify a chat window or update UI
        console.log("Message for active conversation:", message);
      } else {
        this.incrementUnread(conversationId);
      }
    });
  }

  incrementUnread(conversationId: string) {
    this.conversations = this.conversations.map((conv) =>
      conv.id === conversationId
        ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
        : conv
    );
  }

  resetUnread(conversationId: string) {
    this.conversations = this.conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );
  }

  updateLastMessage(conversationId: string, message: Message) {
    this.conversations = this.conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, lastMessage: message } : conv
    );
  }
}
