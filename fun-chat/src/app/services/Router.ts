import StorageManager from './StorageManager';
import ErrorView from '../view/main/states/ErrorView';
import AuthView from '../view/main/states/AuthView';
import AboutView from '../view/main/states/AboutView';
import ChatView from '../view/main/states/ChatView';
import type AuthService from './websocket/AuthService';
import type MessageService from './websocket/MessageService';
import type BaseElementCreator from '../factory/BaseElementCreator';
import type { RouteType } from '../types/server/RouterType';

export default class Router {
  private container: BaseElementCreator<'div'>;
  private storage: StorageManager;
  private aboutView: AboutView;
  private authService: AuthService;
  private messageService: MessageService;
  private routes: RouteType[];

  constructor(mainContainer: BaseElementCreator<'div'>, auth: AuthService, message: MessageService) {
    this.authService = auth;
    this.messageService = message;
    this.container = mainContainer;
    this.storage = StorageManager.getManager();
    this.aboutView = new AboutView();

    this.aboutView.getBackButton().setCallback(() => window.history.back());

    //todo: add /dialogs amd etc to routes and views for them
    this.routes = [
      {
        path: '/auth',
        view: (): HTMLElement => new AuthView(this.authService, this).getAuth(),
        requiresAuth: false,
        requiresGuest: true,
      },
      {
        path: '/main',
        view: (): HTMLElement => new ChatView(this.messageService, this.authService).getChat(),
        requiresAuth: true,
        requiresGuest: false,
      },
      {
        path: '/about',
        view: (): HTMLElement => this.aboutView.getAbout(),
        requiresAuth: false,
        requiresGuest: false,
      },
    ];

    window.addEventListener('hashchange', () => void this.handleRoute());

    const initial: string = window.location.hash.slice(1) || this.storage.load<string>('route') || '/main';
    void this.navigate(initial);
  }

  public async navigate(path: string): Promise<void> {
    if (window.location.hash !== `#${path}`) {
      window.location.hash = path;
    }
    this.storage.save('route', path);
    await this.handleRoute();
  }

  private async handleRoute(): Promise<void> {
    const path: string = window.location.hash.slice(1) || '/main';
    this.storage.save('route', path);

    const route: RouteType | undefined = this.routes.find((route: RouteType) => route.path === path);
    if (!route) {
      const missing: string = path;
      window.history.replaceState(null, '', '#/error');
      this.renderError(`Page not found: ${missing}`);
      return;
    }

    const logged: boolean = this.authService.isLoggedIn() ?? false;

    if (route.requiresAuth && !logged) return void this.navigate('/auth');
    if (route.requiresGuest && logged) return void this.navigate('/main');

    try {
      const viewElement: HTMLElement = route.view();
      this.container.removeInnerElements();
      this.container.addInnerElement(viewElement);
    } catch (error) {
      this.renderError(`Error while rendering path: '${path}', with error: '${String(error)}'`);
    }
  }

  private renderError(message: string): void {
    const errorView: ErrorView = new ErrorView(message);
    errorView.backButton.getCreatedElement().addEventListener('click', () => window.history.back());
    this.container.removeInnerElements();
    this.container.addInnerElement(errorView.getError());
  }
}
