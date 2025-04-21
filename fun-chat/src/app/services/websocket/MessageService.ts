import type WebSocketManager from './WebSocketManager';
import type { ChatMessageType } from '../../types/server/ChatMessageType';
import type { MessageType } from '../../types/server/MessageType';
import type { UserType } from '../../types/server/UserType';
import ServerError from './ServerError';
import ModalView from '../../view/modal/ModalView.ts';

export default class MessageService {
  private ws: WebSocketManager;

  constructor(ws: WebSocketManager) {
    this.ws = ws;
  }

  public async sendMessage(to: string, text: string): Promise<ChatMessageType> {
    try {
      const response: MessageType<{ message: ChatMessageType }> = await this.ws.sendRequest<{ message: ChatMessageType }>(
        'MSG_SEND',
        { message: { to, text } }
      );
      return response.payload.message;
    } catch (error) {
      if (error instanceof ServerError) {
        new ModalView(error.payload.error);
      }
      throw new Error('Failed to send message');
    }
  }

  public async getMessageHistory(login: string): Promise<ChatMessageType[]> {
    try {
      const response = await this.ws.sendRequest<{ messages: ChatMessageType[] }>(
        'MSG_FROM_USER',
        { user: { login } }
      );
      return response.payload.messages;
    } catch (error: unknown) {
      if (error instanceof ServerError) {
        new ModalView(error.payload.error);
      }
      throw new Error('Failed to fetch message history');
    }
  }

  public async getActiveUsers(): Promise<UserType[]> {
    const response = await this.ws.sendRequest<{ users: UserType[] }>(
      'USER_ACTIVE',
      null
    );
    return response.payload.users;
  }

  public async getInactiveUsers(): Promise<UserType[]> {
    const response = await this.ws.sendRequest<{ users: UserType[] }>(
      'USER_INACTIVE',
      null
    );
    return response.payload.users;
  }

  public onIncoming(handler: (message: ChatMessageType) => void): void {
    this.ws.onMessage('MSG_SEND', (message: MessageType<{ message: ChatMessageType }>) => {
      handler(message.payload.message);
    });
  }

  public onDeliveryStatus(handler: (message: { id: string; status: { isDelivered: boolean } }) => void): void {
    this.ws.onMessage('MSG_DELIVER', (message: MessageType<{ message: { id: string; status: { isDelivered: boolean } } }>) => {
      handler(message.payload.message);
    });
  }

  public onReadStatus(handler: (message: { id: string; status: { isReaded: boolean } }) => void): void {
    this.ws.onMessage('MSG_READ', (message: MessageType<{ message: { id: string; status: { isReaded: boolean } } }>) => {
      handler(message.payload.message);
    });
  }

  public onEdit(handler: (message: { id: string; text: string; status: { isEdited: boolean } }) => void): void {
    this.ws.onMessage('MSG_EDIT', (message: MessageType<{ message: { id: string; text: string; status: { isEdited: boolean } } }>) => {
      handler(message.payload.message);
    });
  }

  public onDelete(handler: (message: { id: string; status: { isDeleted: boolean } }) => void): void {
    this.ws.onMessage('MSG_DELETE', (message: MessageType<{ message: { id: string; status: { isDeleted: boolean } } }>) => {
      handler(message.payload.message);
    });
  }
}
