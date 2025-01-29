export class Theme {
  constructor(switcher) {
    this.SWITCHER = switcher;
    this.THEME_KEY = "theme";

    this.storageTheme = localStorage.getItem(this.THEME_KEY);

    if (!this.storageTheme) {
      this.systemTheme = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;
      this.storageTheme = this.systemTheme ? "light" : "dark";
    }
    this.applyTheme(this.storageTheme);
  }

  init() {
    this.SWITCHER.addEventListener("click", () => this.toggleTheme());
  }

  toggleTheme() {
    this.currentTheme = document.body.classList.contains("dark")
      ? "dark"
      : "light";
    this.nextTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(this.nextTheme);
  }

  applyTheme(theme) {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }
}
