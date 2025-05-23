// services/WebSocketManager.ts
type MessageCallback = (message: any) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private messageListeners: MessageCallback[] = [];

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log("WebSocket connected");
    this.socket.onclose = () => console.log("WebSocket disconnected");
    this.socket.onerror = (err) => console.error("WebSocket error:", err);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageListeners.forEach((cb) => cb(data));
    };
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  joinRoom(conversationId: string) {
    this.send({ action: "join-room", conversationId });
  }

  leaveRoom(conversationId: string) {
    this.send({ action: "leave-room", conversationId });
  }

  onMessage(callback: MessageCallback) {
    this.messageListeners.push(callback);
  }
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;
