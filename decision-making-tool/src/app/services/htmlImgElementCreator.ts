import HtmlElementCreator from './htmlElementCreator.ts';
import type { SettingsType } from '../types/SettingsType.ts';
import type { ElementImgCreatorType } from '../types/ElementImgCreatorType.ts';

export class HtmlImgElementCreator extends HtmlElementCreator implements ElementImgCreatorType {
  public element: HTMLImageElement;

  constructor(settings: SettingsType) {
    super(settings);
    this.element = document.createElement('img');
    this.setClassNames(settings.classNames);
    if (settings.textContent) this.setTextContent(settings.textContent);
    if (settings.callback) this.setCallback(settings.callback);
    if (settings.src) this.setSrc(settings.src);
    if (settings.alt) this.setAlt(settings.alt);
  }

  public setSrc(source: string): void {
    this.element.src = source;
  }

  public setAlt(alt: string): void {
    this.element.alt = alt;
  }
}
