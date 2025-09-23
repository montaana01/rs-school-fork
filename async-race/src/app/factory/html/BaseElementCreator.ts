import type { SettingsType } from '../../types/SettingsType';
import type { BaseElementCreatorType } from '../../types/BaseElementCreatorType.ts';

export default class BaseElementCreator<T extends keyof HTMLElementTagNameMap> implements BaseElementCreatorType<T> {
  public element!: HTMLElementTagNameMap[T];

  constructor(settings: SettingsType<T>) {
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

  public createHtmlElement(settings: SettingsType<T>): void {
    this.element = document.createElement(settings.tagName);
    this.setClassNames(settings.classNames);
    if (settings.textContent) this.setTextContent(settings.textContent);
    if (settings.callback) this.setCallback(settings.callback);
  }

  public getCreatedElement(): HTMLElementTagNameMap[T] {
    return this.element;
  }

  public removeInnerElements(): void {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  public addInnerElement(element: HTMLElement): void {
    this.element.append(element);
  }
}
