import View from '../view.ts';
import type { SettingsType } from '../../types/SettingsType.ts';
import HtmlElementCreator from '../../services/htmlElementCreator.ts';

export default class MainView extends View {
  private readonly containerWithRouter: HtmlElementCreator;

  constructor() {
    const mainSettings: SettingsType = {
      tagName: 'main',
      classNames: ['main'],
    };
    super(mainSettings);

    const containerSettings: SettingsType = {
      tagName: 'div',
      classNames: ['container', 'router'],
    };

    this.containerWithRouter = new HtmlElementCreator(containerSettings);

    this.configureView();
  }

  public configureView(): void {
    this.elementCreator.addInnerHtmlCreatorElement(this.containerWithRouter);
  }
  public getRouterContainer(): HTMLElement {
    return this.containerWithRouter.getCreatedElement();
  }
}
