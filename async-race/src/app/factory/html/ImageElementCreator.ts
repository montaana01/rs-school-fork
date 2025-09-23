import HtmlElementCreator from './BaseElementCreator';
import type { SettingsType } from '../../types/SettingsType';

export default class ImageElementCreator extends HtmlElementCreator<'img'> {
  constructor(settings: SettingsType<'img'>) {
    super(settings);
    this.setImageAttributes(settings);
  }

  public setSrc(source: string): void {
    this.element.src = source;
  }

  public setAlt(alt: string): void {
    this.element.alt = alt;
  }

  private setImageAttributes(settings: SettingsType<'img'>): void {
    if (settings.src) {
      this.element.src = settings.src;
    }
    if (settings.alt) {
      this.element.alt = settings.alt;
    }
  }
}
