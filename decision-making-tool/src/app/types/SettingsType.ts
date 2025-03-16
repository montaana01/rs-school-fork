export type SettingsType = {
  tagName: string;
  classNames: string[];
  textContent?: string;
  callback?: ((event: Event) => void) | null;
  src?: string;
  alt?: string;
};
