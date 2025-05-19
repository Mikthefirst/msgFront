// services/ConversationService.ts
import { Conversation } from "../types";

export default class ConversationService {
  async fetchConversations(): Promise<Conversation[]> {
    const res = await fetch("http://localhost:3000/conversations/for-user", {credentials:"include", method:"GET"});
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return await res.json();
  }
}
