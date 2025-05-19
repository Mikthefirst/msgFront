
import { makeAutoObservable } from "mobx";
import { ChatStore } from "./ChatStore";
import { ConversationStore } from "./ConversationStore";

export class RootStore {
  chatStore: ChatStore;
  conversationStore: ConversationStore;

  constructor() {
    this.chatStore = new ChatStore(this);
    this.conversationStore = new ConversationStore(this);
    makeAutoObservable(this);
  }
}

export const rootStore = new RootStore();
