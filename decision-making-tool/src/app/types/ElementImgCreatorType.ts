import type { ElementCreatorType } from './ElementCreatorType.ts';

export type ElementImgCreatorType = ElementCreatorType & {
  element: HTMLImageElement;
  setSrc: (source: string) => void;
  setAlt: (alt: string) => void;
};
