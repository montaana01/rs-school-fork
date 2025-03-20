import HtmlElementCreator from './htmlElementCreator.ts';
import type { SettingsType } from '../types/SettingsType.ts';
import type { ElementTextAreaCreatorType } from '../types/ElementTextAreaCreatorType';

export class HtmlTextAreaElementCreator extends HtmlElementCreator implements ElementTextAreaCreatorType {
  public element: HTMLTextAreaElement;

  constructor(settings: SettingsType) {
    super(settings);
    this.element = document.createElement('textarea');

    this.setClassNames(settings.classNames);
    if (settings.textContent) this.setTextContent(settings.textContent);
    if (settings.callback) this.setCallback(settings.callback);
    if (settings.value) this.setValue(settings.value);
    if (settings.placeholder) this.setPlaceholder(settings.placeholder);

    if (settings.cols) this.setCols(settings.cols);
    if (settings.rows) this.setRows(settings.rows);
    if (settings.wrap) this.setWrap(settings.wrap);
  }

  public setValue(value: string): void {
    this.element.value = value;
  }

  public setPlaceholder(placeholder: string): void {
    this.element.placeholder = placeholder;
  }

  public setCols(cols: number): void {
    this.element.cols = cols;
  }

  public setRows(rows: number): void {
    this.element.rows = rows;
  }

  public setWrap(wrap: boolean): void {
    this.element.wrap = wrap ? 'hard' : 'soft';
  }
}
