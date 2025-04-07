import GarageStateView from './view/main/states/GarageStateView.ts';
import WinnersStateView from './view/main/states/WinnersStateView.ts';
import StorageManager from './services/StorageManager.ts';
import ErrorStateView from './view/main/states/ErrorStateView.ts';

const STORAGE_KEY: string = 'route';
const ROUTES: Record<string, () => HTMLElement> = {
  '/': (): HTMLElement => new GarageStateView().getGarage(),
  '/garage': (): HTMLElement => new GarageStateView().getGarage(),
  '/winners': (): HTMLElement => new WinnersStateView().getWinners(),
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

  public navigate(path: string, updateHistory: boolean = true): void {
    if (updateHistory) {
      window.history.pushState({}, '', path);
    }
    this.storageManager.save(STORAGE_KEY, path);
    this.handleRouteChange();
  }

  private handleRouteChange(): void {
    const currentPath: string = window.location.pathname;
    const containerView = ROUTES[currentPath] || this.getErrorView.bind(this);

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(containerView());
  }

  private getErrorView(): HTMLElement {
    const errorView: ErrorStateView = new ErrorStateView('Error: Page not found!');
    errorView.homeButton.getCreatedElement().addEventListener('click', () => {
      this.navigate('/');
    });
    return errorView.getError();
  }
}
