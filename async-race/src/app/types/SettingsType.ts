export type SettingsType<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  tagName: T;
  classNames: string[];
  textContent?: string;
  callback?: ((event: Event) => void) | null;
  src?: string;
  alt?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  cols?: number;
  rows?: number;
  textLength?: number;
  wrap?: boolean;
};
