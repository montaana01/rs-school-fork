import './../style.scss';
import './view/assets.scss';
import './view/main/main.scss';
import HeaderView from './view/header/headerView.ts';
import MainView from './view/main/main.ts';
import FooterView from './view/footer/footerView.ts';

export default class App {
  private BODY: HTMLElement;
  private headerView: HeaderView;
  private mainView: HeaderView;
  private footerView: FooterView;

  constructor() {
    this.BODY = document.body;
    this.headerView = new HeaderView();
    this.mainView = new MainView();
    this.footerView = new FooterView();
    this.createView();
  }

  private createView(): void {
    //todo: use theme switcher class for remove hardcode
    this.BODY.classList.add('light');
    this.BODY.append(
      this.headerView.getHTMLElement(),
      this.mainView.getHTMLElement(),
      this.footerView.getHTMLElement(),
    );
  }
}
