import './../style.scss';
import './view/assets.scss';
import './view/main/main.scss';
import FooterView from './view/footer/footerView.ts';
import HeaderView from './view/header/headerView.ts';
import decisionMakingToolLogo from '/icons/decision-making-tool.png';

export default class App {
  private BODY: HTMLElement;
  private headerView: HeaderView;
  private mainView: HTMLElement;
  private footerView: FooterView;

  constructor() {
    this.BODY = document.body;
    this.headerView = new HeaderView();
    this.mainView = document.createElement('main');
    this.footerView = new FooterView();
    this.createView();
  }

  private createView(): void {
    this.BODY.append(this.headerView.getHTMLElement(), this.mainView, this.footerView.getHTMLElement());
    document.querySelector<HTMLDivElement>('main')!.innerHTML = `
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="${decisionMakingToolLogo}" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img src="${decisionMakingToolLogo}" class="logo vanilla" alt="TypeScript logo" />
        </a>
      </div>
    `;
  }
}
