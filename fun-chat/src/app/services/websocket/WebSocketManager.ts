import ModalView from './../../view/modal/ModalView';
import ServerError from './ServerError.ts';
import type { MessageType } from '../../types/server/MessageType.ts';

type MessageHandler<T = any> = (message: MessageType<T>) => void;
type EventHandler = () => void;

export default class WebSocketManager {
  public onOpen?: EventHandler;
  public onClose?: EventHandler;
  public onError?: (error: Event) => void;
  public socket: WebSocket | null;

  private readonly url: string;
  private pendingRequests: Map<string, {resolve: Function; reject: Function}>;
  private messageHandlers: Map<string, MessageHandler[]>;

  private reconnectAttempts: number;
  private readonly maxRetries: number;
  private readonly baseDelay: number;
  private shouldReconnect: boolean;

  constructor(host: string, port: number, secured: boolean, shouldReconnect: boolean, retries: number, delay: number) {
    this.socket = null;
    this.pendingRequests = new Map<string, { resolve: Function; reject: Function }>();
    this.messageHandlers = new Map<string, MessageHandler[]>();
    this.reconnectAttempts = 0;
    this.shouldReconnect = shouldReconnect;
    this.maxRetries = retries;
    this.baseDelay = delay;

    const protocol: 'wss' | 'ws' = secured ? 'wss' : 'ws';
    this.url = `${protocol}://${host}:${port}`;
  }

  public connect(): void {
    if (!this.shouldReconnect) return;
    this.socket = new WebSocket(this.url);

    this.socket.onopen = (): void => {
      this.reconnectAttempts = 0;
      this.onOpen?.();
    };

    this.socket.onclose = (): void => {
      this.onClose?.();
      if (this.shouldReconnect) this.scheduleReconnect();
    };

    this.socket.onerror = (event: Event): void => {
      this.onError?.(event);
      if (this.shouldReconnect) this.scheduleReconnect();
    };

    this.socket.onmessage = (event: MessageEvent): void => {
      const message = JSON.parse(event.data);
      if (message.id && this.pendingRequests.has(message.id)) {
        const { resolve, reject } = this.pendingRequests.get(message.id)!;
        if (message.type === 'ERROR') {
          reject(new ServerError(message.payload));
        } else {
          resolve(message);
        }
        this.pendingRequests.delete(message.id);
      }
      const handlers: MessageHandler[] = this.messageHandlers.get(message.type) || [];
      handlers.forEach(handler => handler(message));
    };
  }

  public sendRequest<T>(type: string, payload: any): Promise<MessageType<T>> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return Promise.reject(new ModalView('WebSocket is not connected'));
    }
    return new Promise((resolve, reject) => {
      const id: `${string}-${string}-${string}-${string}-${string}` = crypto.randomUUID();
      this.pendingRequests.set(id, { resolve, reject });
      this.socket!.send(JSON.stringify({ id, type, payload }));
    });
  }

  public onMessage<T>(type: string, handler: MessageHandler<T>): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxRetries) {
      new ModalView('Failed to reconnect:', false);
      return;
    }
    const delay: number = this.baseDelay * (2 ** this.reconnectAttempts);
    this.reconnectAttempts++;
    new ModalView(`Connection lost, reestablishing via ${delay / 1000}с...`);
    setTimeout(() => this.connect(), delay);
  }
}
