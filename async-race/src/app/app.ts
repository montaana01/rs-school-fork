import './../style.scss';
import porsche from '/cars/porsche.svg';

import './view/assets.scss';
import ThemeManager from './services/themeManager';

export default class App {
  private BODY: HTMLElement;
  private theme: ThemeManager;

  constructor() {
    this.BODY = document.body;
    this.theme = new ThemeManager();
  }

  public createView(): void {
    this.BODY.innerHTML = `
    <div class="container">
        <a href="https://vite.dev" target="_blank">
          <img src="${porsche}" class="logo" alt="Vite logo" />
        </a>
        <a href="https://rs.school/" target="_blank">
        </a>
        <button id="toggleButton" class="button">Toggle</button>  
        <h1>Async Race</h1>
      </div>
    `;
    const toggleButton: HTMLElement | null = document.querySelector('#toggleButton');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        this.theme.toggleTheme();
      });
    }
    // this.BODY.append(
    //   this.headerView.getHTMLElement(),
    //   this.mainView.getHTMLElement(),
    //   this.footerView.getHTMLElement(),
    // );
  }
}
