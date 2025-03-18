import HtmlElementCreator from './htmlElementCreator.ts';
import type { SettingsType } from '../types/SettingsType.ts';
import type { ElementInputCreatorType } from '../types/ElementInputCreatorType.ts';

export class HtmlInputElementCreator extends HtmlElementCreator implements ElementInputCreatorType {
  public element: HTMLInputElement;

  constructor(settings: SettingsType) {
    super(settings);
    this.element = document.createElement('input');
    this.setClassNames(settings.classNames);
    if (settings.textContent) this.setTextContent(settings.textContent);
    if (settings.callback) this.setCallback(settings.callback);
    if (settings.value) this.setValue(settings.value);
    if (settings.placeholder) this.setPlaceholder(settings.placeholder);
    if (settings.type) this.setType(settings.type);
  }

  public setValue(value: string): void {
    this.element.value = value;
  }
  public setPlaceholder(placeholder: string): void {
    this.element.placeholder = placeholder;
  }

  public setType(type: string): void {
    this.element.type = type;
  }
}
