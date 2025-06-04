import { server } from './../../../project/src/store/services/groupsService';
//RootStore.ts
import { makeAutoObservable } from "mobx";
import { ChatStore } from "./ChatStore";
import { ConversationStore } from "./ConversationStore";
import { UserStore } from "./UserStore";
import webSocketManager from "../ws/WebSocketManager";
import { Message } from "../types";
const server = "http://localhost:3000";

export class RootStore {
  chatStore: ChatStore;
  conversationStore: ConversationStore;
  userStore: UserStore;
  server: string;
  constructor() {
    this.chatStore = new ChatStore(this);
    this.conversationStore = new ConversationStore(this);
    this.userStore = new UserStore(this);
    this.server = server;
    
    makeAutoObservable(this);
    webSocketManager.connect(server);

    // Подписка на входящие сообщения по сокету
    webSocketManager.onMessage((message: Message) => {
      this.chatStore.handleIncomingMessage(message);
    });
  }
}

export const rootStore = new RootStore();
