// ws/WebSocketManager.ts
import { io, Socket } from "socket.io-client";

class WebSocketManager {
  private socket: Socket | null = null;

  connect(url: string) {
    if (this.socket) return;

    this.socket = io(url, {
      transports: ["websocket"], // optional, ensures WS not polling
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  joinRoom(conversationId: string) {
    if (this.socket) {
      this.socket.emit("join-room", conversationId);
    }
  }

  leaveRoom(conversationId: string) {
    if (this.socket) {
      this.socket.emit("leave-room", conversationId);
    }
  }

  onMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("new-message", callback);
    }
  }

  sendMessage(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;
