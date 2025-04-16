import type { SettingsType } from './SettingsType';

export type BaseElementCreatorType<T extends keyof HTMLElementTagNameMap> = {
  element: HTMLElementTagNameMap[T];
  createHtmlElement(settings: SettingsType<T>): void;
  setClassNames(classNames: string[]): void;
  removeClassNames(classNames: string[]): void;
  setTextContent(textContent: string): void;
  setCallback(callback: (event: Event) => void): void;
  getCreatedElement(): HTMLElementTagNameMap[T];
  addInnerElement(element: HTMLElement): void;
  removeInnerElements(): void;
};
