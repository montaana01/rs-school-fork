import { Header } from "./html/Header.js";
import { Footer } from "./html/Footer.js";
import { Game } from "./html/Game.js";
import { Theme } from "./Theme.js";

export class Nonograms {
  constructor(solutions) {
    this.solutions = solutions;
    this.currentGame = null;
  }

  start(difficult, levelName) {
    const template = this.solutions[difficult].templates.find(
      (template) => template.name === levelName
    );
    this.currentGame = new Game(this.solutions[difficult].size, template.data);

    //here some code for starting game
    const SCRIPT = document.body.querySelector("script");
    const header = new Header();
    const footer = new Footer();

    SCRIPT.before(header.getElement());
    SCRIPT.before(this.currentGame.render());
    SCRIPT.before(footer.getElement());
    const THEME = new Theme(header.getThemeSwitcher());
    THEME.init();
  }

  pause() {
    //here code for pause
  }

  finish() {
    //here call to finish screen with stats
  }
}
