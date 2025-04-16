import './../style.scss';
import './assets.scss';

import ThemeManager from './services/ThemeManager';
import FooterView from './view/footer/FooterView';
import HeaderView from './view/header/HeaderView.ts';

const APP_NAME: string = 'Fun Chat!';
export default class App {
  private BODY: HTMLElement;
  private headerView: HeaderView;
  private footerView: FooterView;
  private readonly theme: ThemeManager;

  constructor() {
    this.BODY = document.body;
    this.headerView = new HeaderView(APP_NAME);
    this.footerView = new FooterView();
    this.theme = new ThemeManager();
  }

  public startApp(): void {
    if (this.headerView.themeSwitcher) {
      this.headerView.themeSwitcher.init(this.theme);
    }
    this.BODY.append(this.headerView.getHeader());
    this.BODY.append(this.footerView.getFooter());
  }
}
