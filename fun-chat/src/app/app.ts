import ThemeManager from './services/ThemeManager';
import Router from './services/Router';

import WebSocketManager from './services/websocket/WebSocketManager';
import AuthService from './services/websocket/AuthService';

import HeaderView from './view/header/HeaderView';
import MainView from './view/main/MainView';
import FooterView from './view/footer/FooterView';
import ModalView from './view/modal/ModalView';

const APP_NAME: string = 'Fun Chat!';

export default class App {
  private readonly BODY: HTMLElement;
  private headerView: HeaderView = new HeaderView(APP_NAME);
  private mainView: MainView = new MainView();
  private footerView: FooterView = new FooterView();

  private theme: ThemeManager = new ThemeManager();
  private webSocketManager!: WebSocketManager;
  private auth!: AuthService;
  private router!: Router;

  constructor() {
    this.BODY = document.body;

    this.headerView.themeSwitcher.init(this.theme);

    this.initWebSocket().then(async () => {
      await this.auth.init();
      this.router = new Router(this.mainView.getContainer(), this.auth)
      this.initAuthListeners();
      this.startApp();
    });
  }

  public startApp(): void {
    this.BODY.append(this.headerView.getHeader(), this.mainView.getMain(), this.footerView.getFooter());

    this.headerView.logoWrapper.setCallback(() => this.router.navigate('/'));
    this.headerView.aboutButton.setCallback(() => this.router.navigate('/about'));

    this.headerView.logoutButton.getCreatedElement().addEventListener('click', async () => {
      try {
        await this.auth.logout();
        await this.router.navigate('/auth');
      } catch (error) {
        new ModalView(`Logout failed ${error}`, false);
      }
    });
  }

  private async initWebSocket(): Promise<void> {
    this.webSocketManager = new WebSocketManager('localhost', 4000, false, true, 5, 1000);
    this.auth = new AuthService(this.webSocketManager);

    return new Promise((resolve) => {
      this.webSocketManager.onOpen = async (): Promise<void> => {
        resolve();
      };

      this.webSocketManager.onError = (error): void => {
        new ModalView(`WebSocket error: ${error}`, false);
        resolve();
      };

      this.webSocketManager.connect();
    });
  }

  private initAuthListeners(): void {
    this.auth.subscribe(({ loggedIn, user }) => {
      if (loggedIn && user) {
        this.headerView.updateHeaderGreetings(user.login);
        this.headerView.showLogout();
      } else {
        this.headerView.updateHeaderGreetings('Guest');
        this.headerView.hideLogout();
      }
    });
  }
}
