import GarageStateView from './view/main/states/GarageStateView';
import WinnersStateView from './view/main/states/WinnersStateView';
import StorageManager from './services/StorageManager';
import ErrorStateView from './view/main/states/ErrorStateView';
import Modal from './view/modal/modal';

const STORAGE_KEY: string = 'route';
const ROUTES: Record<string, () => Promise<HTMLElement>> = {
  '#/': (): Promise<HTMLElement> => new GarageStateView().getGarage(),
  '#/garage': (): Promise<HTMLElement> => new GarageStateView().getGarage(),
  '#/winners': (): Promise<HTMLElement> => new WinnersStateView().getWinners(),
};

export default class Router {
  private storageManager: StorageManager;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.storageManager = StorageManager.getManager();
    this.container = container;

    if (!window.location.hash)
      this.navigate('#/').catch((error) => {
        new Modal(`Error while rendering page: ${error}`);
      });

    window.addEventListener('hashchange', this.handleRouteChange.bind(this));
    window.addEventListener('load', this.handleRouteChange.bind(this));
  }

  public async navigate(path: string): Promise<void> {
    window.location.hash = path;
    this.storageManager.save(STORAGE_KEY, path);
    await this.handleRouteChange();
  }

  private async handleRouteChange(): Promise<void> {
    const currentPath: string = window.location.hash;
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
