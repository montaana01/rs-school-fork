import './../style.scss';
const APP_NAME: string = 'Fun Chat!';
export default class App {
  private BODY: HTMLElement;

  constructor() {
    this.BODY = document.body;
  }

  public startApp(): void {
    this.BODY.append(APP_NAME);
    console.log(APP_NAME)
  }
}
