import type { SettingsType } from './SettingsType.ts';

export type ElementCreatorType = {
  element: HTMLElement;
  setClassNames: (classNames: string[]) => void;
  setTextContent: (textContent: string) => void;
  setCallback: (callback: (event: Event) => void) => void;
  createHtmlElement(settings: SettingsType): void;
  getElement(): HTMLElement;
};
