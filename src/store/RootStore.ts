//RootStore.ts
import { makeAutoObservable } from "mobx";
import { ChatStore } from "./ChatStore";
import { ConversationStore } from "./ConversationStore";
import { UserStore } from "./UserStore";

export class RootStore {
  chatStore: ChatStore;
  conversationStore: ConversationStore;
  userStore: UserStore;

  constructor() {
    this.chatStore = new ChatStore(this);
    this.conversationStore = new ConversationStore(this);
    this.userStore = new UserStore(this);
    makeAutoObservable(this);
  }
}

export const rootStore = new RootStore();
