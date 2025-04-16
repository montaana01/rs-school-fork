import HtmlElementCreator from './BaseElementCreator';
import type { SettingsType } from '../types/SettingsType';

export default class InputElementCreator extends HtmlElementCreator<'input'> {
  constructor(settings: SettingsType<'input'>) {
    super(settings);
    this.setInputAttributes(settings);
  }

  public setType(type: string): void {
    this.element.type = type;
  }

  public setValue(value: string): void {
    this.element.value = value;
  }

  public setPlaceholder(placeholder: string): void {
    this.element.placeholder = placeholder;
  }

  private setInputAttributes(settings: SettingsType<'input'>): void {
    if (settings.type) {
      this.element.type = settings.type;
    }
    if (settings.value) {
      this.element.value = settings.value;
    }
    if (settings.placeholder) {
      this.element.placeholder = settings.placeholder;
    }
  }
}
