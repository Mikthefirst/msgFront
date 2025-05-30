//RootStore.ts
import { makeAutoObservable } from "mobx";
import { ChatStore } from "./ChatStore";
import { ConversationStore } from "./ConversationStore";
import { UserStore } from "./UserStore";
import webSocketManager from "../ws/WebSocketManager";
import { Message } from "../types";


export class RootStore {
  chatStore: ChatStore;
  conversationStore: ConversationStore;
  userStore: UserStore;

  constructor() {
    this.chatStore = new ChatStore(this);
    this.conversationStore = new ConversationStore(this);
    this.userStore = new UserStore(this);
    makeAutoObservable(this);
    webSocketManager.connect("http://localhost:3000");

    // Подписка на входящие сообщения по сокету
    webSocketManager.onMessage((message: Message) => {
      this.chatStore.handleIncomingMessage(message);
    });
  }
}

export const rootStore = new RootStore();
