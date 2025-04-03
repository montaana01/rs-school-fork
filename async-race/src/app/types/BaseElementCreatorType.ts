import type { SettingsType } from './SettingsType.ts';

export type BaseElementCreatorType<T extends keyof HTMLElementTagNameMap> = {
  element: HTMLElementTagNameMap[T];
  setClassNames(classNames: string[]): void;
  removeClassNames(classNames: string[]): void;
  setTextContent(textContent: string): void;
  setCallback(callback: (event: Event) => void): void;
  createHtmlElement(settings: SettingsType<T>): void;
  getCreatedElement(): HTMLElementTagNameMap[T];
  removeInnerElements(): void;
  addInnerElement(element: HTMLElement): void;
};
