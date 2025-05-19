// stores/ConversationStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { Conversation, Message } from "../types";
import ConversationService from "../service/ConversationService";

export class ConversationStore {
  rootStore: RootStore;
  conversationService = new ConversationService();

  conversations: Conversation[] = [];
  activeConversationId: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
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

  setActiveConversation(id: string) {
    this.activeConversationId = id;
    this.resetUnread(id);
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
