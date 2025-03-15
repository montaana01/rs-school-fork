import HtmlElementCreator from '../services/htmlElementCreator.ts';
import type { SettingsType } from '../types/SettingsType.ts';

export default class View {
  protected elementCreator: HtmlElementCreator;
  private readonly settings: SettingsType;

  constructor(settings: SettingsType) {
    this.settings = settings;
    this.elementCreator = this.createView();
  }

  public getHTMLElement(): HTMLElement {
    return this.elementCreator.getElement();
  }

  public createView(): HtmlElementCreator {
    return new HtmlElementCreator(this.settings);
  }
}
