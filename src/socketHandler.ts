import { EVENT_TYPE, FEED_TYPE } from "./constants";

export interface WebSocketMessage {
  event: typeof EVENT_TYPE | "unsubscribe";
  feed: typeof FEED_TYPE;
  product_ids: string[];
}

export interface WebSocketInitializer {
  onClose: EventListener;
  onError: EventListener;
  onMessage: EventListener;
  onOpen: EventListener;
}

export enum SOCKET_STATES {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export class SocketHandler {
  baseUrl: string;
  activeSocket: WebSocket | null;

  constructor(baseUrl: string = "wss://www.cryptofacilities.com/ws/v1") {
    this.baseUrl = baseUrl;
    this.activeSocket = null;
  }

  initialize({
    onClose,
    onError,
    onMessage,
    onOpen,
  }: WebSocketInitializer): WebSocket {
    if (this.activeSocket) {
      return this.activeSocket;
    }

    this.activeSocket = new WebSocket(this.baseUrl);

    this.activeSocket.addEventListener("close", onClose);
    this.activeSocket.addEventListener("message", onMessage);
    this.activeSocket.addEventListener("open", onOpen);
    this.activeSocket.addEventListener("error", onError);

    return this.activeSocket;
  }

  terminate(): void {
    if (this.activeSocket) {
      this.activeSocket.close();
      this.activeSocket = null;
    }
  }

  sendMessage(message: WebSocketMessage): void {
    this.sendGenericMessage(message);
  }

  sendGenericMessage(message: any): void {
    try {
      const stringifiedMessage = JSON.stringify(message);

      if (this.activeSocket) {
        this.activeSocket.send(stringifiedMessage);
      } else {
        console.error("No initialized socket connection");
      }
    } catch {
      console.error("An unknown error occurred sending websocket message");
    }
  }

  get currentSocketState(): null | string {
    if (this.activeSocket) {
      return SOCKET_STATES[this.activeSocket.readyState];
    }

    return null;
  }
}

const socketHandler = new SocketHandler();

export default socketHandler;
