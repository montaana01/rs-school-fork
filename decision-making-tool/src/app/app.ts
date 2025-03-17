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

  constructor() {
    this.BODY = document.body;

    this.headerView = new HeaderView();
    this.mainView = new MainView();
    this.footerView = new FooterView();
    new Theme();
    new Router(this.mainView.getRouterContainer());
  }

  public createView(): void {
    this.BODY.append(
      this.headerView.getHTMLElement(),
      this.mainView.getHTMLElement(),
      this.footerView.getHTMLElement(),
    );
  }
}
