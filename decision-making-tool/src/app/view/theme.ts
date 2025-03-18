import StorageManager from './../services/storageManager';

enum ThemeEnum {
  Dark = 'dark',
  Light = 'light',
}

export default class Theme {
  private storageManager: StorageManager;
  private readonly THEME_KEY: string;

  constructor() {
    this.THEME_KEY = 'theme';
    this.storageManager = StorageManager.getInstance();

    const savedTheme: string | null = this.storageManager.load<string>(this.THEME_KEY);
    const isValidTheme = savedTheme === ThemeEnum.Dark || savedTheme === ThemeEnum.Light;
    const systemPrefersLight: boolean = window.matchMedia('(prefers-color-scheme: light)').matches;

    const initialTheme: string = isValidTheme ? savedTheme : systemPrefersLight ? ThemeEnum.Light : ThemeEnum.Dark;
    this.applyTheme(initialTheme);
  }

  public toggleTheme(): void {
    const currentTheme: string = document.body.classList.contains(ThemeEnum.Dark) ? ThemeEnum.Dark : ThemeEnum.Light;
    const newTheme: string = currentTheme === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark;
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: string): void {
    document.body.classList.remove(ThemeEnum.Light, ThemeEnum.Dark);
    document.body.classList.add(theme);
    this.storageManager.save(this.THEME_KEY, theme);
  }
}
