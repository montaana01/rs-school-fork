import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

export default class App {
  private BODY: HTMLElement;
  private readonly MAIN: HTMLElement;

  constructor() {
    this.BODY = document.body;
    this.MAIN = document.createElement('main');
  }
  public init(): void {
    this.BODY.appendChild(this.MAIN);

    document.querySelector<HTMLDivElement>('main')!.innerHTML = `
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="${viteLogo}" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
        </a>
        <h1>Decision Making Tool</h1>
      </div>
    `;
  }
}
