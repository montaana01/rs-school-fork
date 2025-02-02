import { Header } from "./html/Header.js";
import { Footer } from "./html/Footer.js";
import { Game } from "./html/Game.js";
import { Theme } from "./Theme.js";

export class Nonograms {
  constructor() {
    this.solutions = null;
    this.header = null;
    this.footer = null;
    this.currentGame = null;
    this.SCRIPT = document.body.querySelector("script");
  }

  initUi() {
    localStorage.setItem("difficulty", "easy");
    this.header = new Header();
    this.footer = new Footer();
    this.currentGame = new Game();

    this.SCRIPT.before(this.header.getElement());
    this.SCRIPT.before(this.currentGame.render());
    this.SCRIPT.before(this.footer.getElement());
    const THEME = new Theme(this.header.getThemeSwitcher());
    THEME.init();
    window.addEventListener("gameStart", () =>
      this.start(
        localStorage.getItem("difficulty"),
        localStorage.getItem("currentLevel")
      )
    );
  }

  initSolutions(solutions) {
    this.solutions = solutions;
    //todo: implement carousel to game class
    //this.currentGame.showCarousel(this.solutions);
  }

  start(difficult, levelName) {
    if (this.currentGame && this.currentGame.MAIN.element.parentNode) {
      this.currentGame.MAIN.element.remove();
    }
    const template = this.solutions[difficult].templates.find(
      (template) => template.name === levelName
    );
    this.currentGame = new Game(this.solutions[difficult].size, template.data);
    this.FOOTER = document.body.querySelector("footer");
    this.FOOTER.before(this.currentGame.render());
  }

  finish() {
    //here call to finish screen with stats
  }
}
