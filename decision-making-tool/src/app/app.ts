import './../style.scss';
import './view/assets.scss';
import './view/main/main.scss';

import HeaderView from './view/header/headerView.ts';
import MainView from './view/main/mainView.ts';
import FooterView from './view/footer/footerView.ts';
import Router from './router';
import Theme from './view/theme.ts';

export default class App {
  private BODY: HTMLElement;
  private headerView: HeaderView;
  private mainView: MainView;
  private footerView: FooterView;
  private readonly router: Router;

  constructor() {
    this.BODY = document.body;

    this.mainView = new MainView();
    this.router = new Router(this.mainView.getRouterContainer());
    this.headerView = new HeaderView(this.router);
    this.footerView = new FooterView();
    new Theme();
  }

  public createView(): void {
    this.BODY.append(
      this.headerView.getHTMLElement(),
      this.mainView.getHTMLElement(),
      this.footerView.getHTMLElement(),
    );
  }
}
