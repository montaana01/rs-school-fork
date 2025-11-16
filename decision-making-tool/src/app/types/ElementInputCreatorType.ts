import type { ElementCreatorType } from './ElementCreatorType.ts';

export type ElementInputCreatorType = ElementCreatorType & {
  element: HTMLInputElement;
  setValue: (value: string) => void;
  setPlaceholder: (placeholder: string) => void;
  setType: (type: string) => void;
};
