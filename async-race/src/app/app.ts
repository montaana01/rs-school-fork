import './../style.scss';

import './view/assets.scss';
import ThemeManager from './services/themeManager';
import FooterView from './view/footer/FooterView.ts';
import HeaderView from './view/header/HeaderView.ts';

export default class App {
  private BODY: HTMLElement;
  private theme: ThemeManager;
  private headerView: HeaderView;
  private footerView: FooterView;

  constructor() {
    this.BODY = document.body;
    this.headerView = new HeaderView();

    this.footerView = new FooterView();
    this.theme = new ThemeManager();
  }

  public startApp(): void {
    if (this.headerView.themeToggle) {
      this.headerView.themeToggle.setCallback(() => this.theme.toggleTheme());
    }
    this.BODY.append(this.headerView.getHeader());
    this.BODY.append(this.footerView.getFooter());
  }
}
