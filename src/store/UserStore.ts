// stores/UserStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { User } from "../types";
import UserService from "./services/UserService";

export class UserStore {
  rootStore: RootStore;
  userService = new UserService();

  user: User | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async fetchUserInfo() {
    try {
      const data = await this.userService.fetchUserInfo();
      console.log(data);
      runInAction(() => {
        this.user = data;
      });
    } catch (e) {
      console.error("Failed to fetch user info:", e);
    }
  }

  clearUser() {
    this.user = null;
  }
}
