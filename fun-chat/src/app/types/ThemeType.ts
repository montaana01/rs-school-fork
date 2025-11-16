import type { ThemeEnum } from '../enums/ThemeEnum.ts';

export type ThemeType = {
  toggleTheme(): void;
  applyTheme(theme: ThemeEnum): void;
};
