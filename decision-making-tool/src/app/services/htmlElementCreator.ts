import type { ElementCreatorType } from '../types/ElementCreatorType.ts';
import type { SettingsType } from '../types/SettingsType.ts';

export default class HtmlElementCreator implements ElementCreatorType {
  public element: HTMLElement;

  constructor(settings: SettingsType) {
    this.element = HTMLElement;
    this.createHtmlElement(settings);
  }

  public setClassNames(classNames: string[]): void {
    classNames.forEach((className: string): void => {
      this.element.classList.add(className);
    });
  }

  public removeClassNames(classNames: string[]): void {
    classNames.forEach((className: string): void => {
      this.element.classList.remove(className);
    });
  }

  public setTextContent(textContent: string): void {
    this.element.textContent = textContent;
  }

  public setCallback(callback: ((event: Event) => void) | null): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event) => callback(event));
    }
  }

  public createHtmlElement(settings: SettingsType): void {
    this.element = document.createElement(settings.tagName);
    this.setClassNames(settings.classNames);
    if (settings.textContent) this.setTextContent(settings.textContent);
    if (settings.callback) this.setCallback(settings.callback);
  }

  public getCreatedElement(): HTMLElement {
    return this.element;
  }

  public addInnerHtmlElement(element: HTMLElement): void {
    this.element.append(element);
  }

  public addInnerHtmlCreatorElement(element: ElementCreatorType): void {
    this.element.append(element.getCreatedElement());
  }
}
