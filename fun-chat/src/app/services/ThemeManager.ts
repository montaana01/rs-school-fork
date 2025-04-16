import type { ThemeType } from '../types/ThemeType';
import { ThemeEnum } from '../enums/ThemeEnum.ts';
import StorageManager from './StorageManager.ts';
import type { StorageType } from '../types/StorageType.ts';

export default class ThemeManager implements ThemeType {
  private storageManager: StorageType;
  private readonly THEME_KEY: string = 'theme';

  constructor() {
    this.storageManager = StorageManager.getManager();

    const savedTheme: ThemeEnum = this.storageManager.load<ThemeEnum>(this.THEME_KEY);
    const isValidTheme: boolean = savedTheme === ThemeEnum.Dark || savedTheme === ThemeEnum.Light;
    const systemPrefersLight: boolean = window.matchMedia('(prefers-color-scheme: light)').matches;

    const initialTheme: ThemeEnum = isValidTheme ? savedTheme : systemPrefersLight ? ThemeEnum.Light : ThemeEnum.Dark;
    this.applyTheme(initialTheme);
  }

  public toggleTheme(): void {
    const currentTheme: ThemeEnum = document.body.classList.contains(ThemeEnum.Dark) ? ThemeEnum.Dark : ThemeEnum.Light;
    const newTheme: ThemeEnum = currentTheme === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark;
    this.applyTheme(newTheme);
  }

  public applyTheme(theme: ThemeEnum): void {
    document.body.classList.remove(ThemeEnum.Light, ThemeEnum.Dark);
    document.body.classList.add(theme);
    this.storageManager.save(this.THEME_KEY, theme);
  }
}
