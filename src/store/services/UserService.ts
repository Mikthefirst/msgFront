// services/ConversationService.ts
import { User } from "../../types";
const server = import.meta.env.VITE_SERVER_URL;

export default class UserService {
   async fetchUserInfo(): Promise<User> {
     const res = await fetch(`${server}/users/get-user`, {
       credentials: "include",
       method: "GET",
     });
     if (!res.ok) throw new Error("Failed to get user info");
     return await res.json();
   }
}
