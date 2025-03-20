import type { ElementCreatorType } from './ElementCreatorType.ts';

export type ElementTextAreaCreatorType = ElementCreatorType & {
  element: HTMLTextAreaElement;
  setValue: (value: string) => void;
  setPlaceholder: (placeholder: string) => void;
  setCols: (cols: number) => void;
  setRows: (rows: number) => void;
  setWrap: (wrap: boolean) => void;
};
