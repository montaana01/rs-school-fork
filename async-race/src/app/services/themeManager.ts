import StorageManager from './../services/storageManager';

enum ThemeEnum {
  Dark = 'dark',
  Light = 'light',
}

type ThemeType = ThemeEnum.Dark | ThemeEnum.Light;

export default class ThemeManager {
  private storageManager: StorageManager;
  private readonly THEME_KEY: string = 'theme';

  constructor() {
    this.storageManager = StorageManager.getManager();

    const savedTheme: ThemeEnum = this.storageManager.load<ThemeType>(this.THEME_KEY);
    const isValidTheme: boolean = savedTheme === ThemeEnum.Dark || savedTheme === ThemeEnum.Light;
    const systemPrefersLight: boolean = window.matchMedia('(prefers-color-scheme: light)').matches;

    const initialTheme: ThemeType = isValidTheme ? savedTheme : systemPrefersLight ? ThemeEnum.Light : ThemeEnum.Dark;
    this.applyTheme(initialTheme);
  }

  public toggleTheme(): void {
    const currentTheme: ThemeEnum = document.body.classList.contains(ThemeEnum.Dark) ? ThemeEnum.Dark : ThemeEnum.Light;
    const newTheme: ThemeEnum = currentTheme === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark;
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: ThemeType): void {
    document.body.classList.remove(ThemeEnum.Light, ThemeEnum.Dark);
    document.body.classList.add(theme);
    this.storageManager.save(this.THEME_KEY, theme);
  }
}
