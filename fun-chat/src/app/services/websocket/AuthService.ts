import type WebSocketManager from './WebSocketManager';
import StorageManager from '../StorageManager';
import type { UserType } from '../../types/server/UserType';
import ServerError from './ServerError';
import ModalView from '../../view/modal/ModalView';
import type { MessageType } from '../../types/server/MessageType';


export default class AuthService {
  private subscribers: ((state: { loggedIn: boolean; user: UserType | null }) => void)[] = [];
  private loggedIn: boolean;
  private isLoggingOut: boolean;
  private currentUser: UserType | null;
  private password: string | null;
  private storage: StorageManager;
  private ws: WebSocketManager;

  constructor(webSocket: WebSocketManager) {
    this.ws = webSocket;
    this.storage = StorageManager.getManager()
    this.loggedIn = this.storage.load<boolean>('isAuthenticated');
    this.isLoggingOut = false;
    this.currentUser = this.loggedIn
      ? this.storage.load<UserType>('currentUser')
      : null;
    this.password = this.loggedIn
      ? this.storage.load<string>('authPassword')
      : null;

    //todo: implement listeners that send to all instance of connection that person is online!
    //this.setupListeners();
  }

  public async init(): Promise<void> {
    if (this.ws.socket?.readyState === WebSocket.OPEN) {
      if (this.loggedIn && this.currentUser && this.password) {
        try {
          await this.login(this.currentUser.login, this.password);
        } catch (error) {
          new ModalView(`Auto re-login failed: ${error}`);
          this.setState(false, null);
        }
      }
    }
  }

  public async login(login: string, password: string): Promise<UserType> {
    try {
      const response = await this.ws.sendRequest<{ user: UserType }>(
        'USER_LOGIN',
        { user: { login, password } }
      );
      const { user } = response.payload;
      this.password = password;
      this.setState(user.isLogined, user);
      return user;
    } catch (error) {
      if (error instanceof ServerError) {
        new ModalView(error.payload.error);
      }
      throw new Error('Unknown login error');
    }
  }

  public async logout(): Promise<void> {
    if (this.isLoggingOut || !this.loggedIn) return;
    this.isLoggingOut = true;

    try {
      if (this.currentUser && this.password) {
        const response: MessageType<{user: UserType}> = await this.ws.sendRequest<{ user: UserType }>(
          'USER_LOGOUT',
          {
            user: {
              login: this.currentUser.login,
              password: this.password
            }
          }
        );

        const { user } = response.payload;
        this.setState(user.isLogined, null);
      } else {
        this.setState(false, null);
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
      this.setState(false, null);
    } finally {
      this.password = null;
      this.isLoggingOut = false;
      this.storage.remove('authPassword');
    }
  }


  public subscribe(callback: (state: { loggedIn: boolean; user: UserType | null }) => void): void {
    this.subscribers.push(callback);
    callback({ loggedIn: this.loggedIn, user: this.currentUser });
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  private setState(loggedIn: boolean, user: UserType | null): void {
    this.loggedIn = loggedIn;
    this.currentUser = user;
    this.storage.save('isAuthenticated', loggedIn);
    if (user) {
      this.storage.save('currentUser', user);
      if (this.password) this.storage.save('authPassword', this.password);
    } else {
      this.storage.remove('currentUser');
    }
    this.subscribers.forEach(callback => callback({ loggedIn, user }));
  }

  // private setupListeners(): void {
  //   this.ws.onMessage('USER_EXTERNAL_LOGIN', 'do something');
  //   this.ws.onMessage('USER_EXTERNAL_LOGOUT', 'do something');
  // }
}
