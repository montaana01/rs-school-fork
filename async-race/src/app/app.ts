import './../style.scss';

import './view/assets.scss';
import ThemeManager from './services/ThemeManager';
import FooterView from './view/footer/FooterView';
import MainView from './view/main/mainView';
import HeaderView from './view/header/HeaderView';
import Router from './Router';

export default class App {
  private BODY: HTMLElement;
  private theme: ThemeManager;
  private headerView: HeaderView;
  private mainView: MainView;
  private footerView: FooterView;
  private router: Router;

  constructor() {
    this.BODY = document.body;
    this.headerView = new HeaderView();
    this.mainView = new MainView();
    this.footerView = new FooterView();
    this.router = new Router(this.mainView.getMainContainer());
    this.theme = new ThemeManager();
  }

  public startApp(): void {
    if (this.headerView.themeToggle) {
      this.headerView.themeToggle.setCallback(() => this.theme.toggleTheme());
    }
    this.BODY.append(this.headerView.getHeader());
    this.BODY.append(this.mainView.getMain());
    this.BODY.append(this.footerView.getFooter());

    this.headerView.logoWrapper.setCallback(() => this.router.navigate('/'));
    this.headerView.garageButton.setCallback(() => this.router.navigate('/garage'));
    this.headerView.winnersButton.setCallback(() => this.router.navigate('/winners'));
  }
}
import './view/media.scss';
