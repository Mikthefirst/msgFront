// services/ConversationService.ts
import { Conversation } from "../../types";
const server = import.meta.env.VITE_SERVER_URL;

export default class ConversationService {
  async fetchConversations(): Promise<Conversation[]> {
    const res = await fetch(`${server}/conversations/for-user`, {credentials:"include", method:"GET"});
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return await res.json();
  }
}
