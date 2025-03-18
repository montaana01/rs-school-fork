import type View from './view/view';
import type { OptionsListItemsType } from './types/OptionsListItemsType';

import ListMainStateView from './view/main/main-states/listMainStateView';
import DecisionMainStateView from './view/main/main-states/decisionMainState';
import ErrorMainStateView from './view/main/main-states/errorMainState';
import ModalWindow from './view/main/modal/modalView';

export default class Router {
  private container: HTMLElement;
  private readonly routes: Record<string, () => View>;
  private dataString: string | null;
  private optionsListItems: OptionsListItemsType[] | undefined;
  private path: string;

  constructor(container: HTMLElement) {
    this.container = container;
    this.path = '';
    this.routes = {
      '#/': (): ListMainStateView => new ListMainStateView(),
      '#/list': (): ListMainStateView => new ListMainStateView(),
      '#/decision': (): DecisionMainStateView => new DecisionMainStateView(),
    };
    this.dataString = localStorage.getItem('options');
    window.addEventListener('hashchange', this.handleRouteChange.bind(this));
    window.addEventListener('load', this.handleRouteChange.bind(this));
  }

  //todo: update this method - maybe move this to new class that's interact with Json
  private static parseOptionsList(json: string): OptionsListItemsType[] {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((item: OptionsListItemsType, index: number) => {
        const title: string = item.title;
        const weight: number = item.weight;
        const id = item.id !== undefined ? item.id : index + 1;
        return { id, title, weight };
      });
    } catch (error) {
      return [];
    }
  }

  public navigate(path: string): void {
    this.path = path;
    window.location.hash = this.path;
  }

  private handleRouteChange(): void {
    let routeFactory = this.routes[window.location.hash];
    if (!routeFactory) {
      routeFactory = (): ErrorMainStateView => new ErrorMainStateView();
    }

    if (window.location.hash === '#decision' && !this.canWeMoveToDecisionWheel()) {
      new ModalWindow('Add at least 2 valid options before choosing a solution!');
      window.location.hash = '#list';
      return;
    }

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    const view: View = routeFactory();
    this.container.appendChild(view.getHTMLElement());
  }

  private canWeMoveToDecisionWheel(): boolean {
    this.dataString = localStorage.getItem('options');
    if (!this.dataString) return false;

    this.optionsListItems = Router.parseOptionsList(this.dataString);

    const valid: OptionsListItemsType[] = this.optionsListItems.filter(
      (option: OptionsListItemsType) => option.title.trim() !== '' && option.weight > 0,
    );
    return valid.length >= 2;
  }
}
