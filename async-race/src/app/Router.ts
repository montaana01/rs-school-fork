import GarageStateView from './view/main/states/GarageStateView.ts';
import WinnersStateView from './view/main/states/WinnersStateView.ts';
import StorageManager from './services/StorageManager.ts';
import ErrorStateView from './view/main/states/ErrorStateView.ts';

const STORAGE_KEY: string = 'route';
const ROUTES: Record<string, () => Promise<HTMLElement>> = {
  '/': (): Promise<HTMLElement> => new GarageStateView().getGarage(),
  '/garage': (): Promise<HTMLElement> => new GarageStateView().getGarage(),
  '/winners': (): Promise<HTMLElement> => new WinnersStateView().getWinners(),
};

export default class Router {
  private storageManager: StorageManager;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.storageManager = StorageManager.getManager();
    this.container = container;

    window.addEventListener('popstate', this.handleRouteChange.bind(this));
    window.addEventListener('load', this.handleRouteChange.bind(this));
  }

  public async navigate(path: string, updateHistory: boolean = true): Promise<void> {
    if (updateHistory) {
      window.history.pushState({}, '', path);
    }
    this.storageManager.save(STORAGE_KEY, path);
    await this.handleRouteChange();
  }

  private async handleRouteChange(): Promise<void> {
    const currentPath: string = window.location.pathname;
    const routeFunction = ROUTES[currentPath] || this.getErrorView.bind(this);
    const view: HTMLElement = await routeFunction();

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(view);
  }

  private async getErrorView(): Promise<HTMLElement> {
    const errorView: ErrorStateView = new ErrorStateView('Error: Page not found!');
    errorView.homeButton.getCreatedElement().addEventListener('click', () => {
      this.navigate('/');
    });
    return errorView.getError();
  }
}
