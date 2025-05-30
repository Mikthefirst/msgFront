// services/ConversationService.ts
import { User } from "../../types";

export default class UserService {
   async fetchUserInfo(): Promise<User> {
     const res = await fetch("http://localhost:3000/users/get-user", {
       credentials: "include",
       method: "GET",
     });
     if (!res.ok) throw new Error("Failed to get user info");
     return await res.json();
   }
}
