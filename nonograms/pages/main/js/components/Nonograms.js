import { Header } from "./html/Header.js";
import { Footer } from "./html/Footer.js";
import { Game } from "./html/Game.js";
import { Theme } from "./Theme.js";

export class Nonograms {
  constructor(difficult) {
    this.difficult = difficult;
  }

  start() {
    //here some code for starting game
    const SCRIPT = document.body.querySelector("script");
    const header = new Header();
    const footer = new Footer();

    //todo create global states class with templates of game!
    const solution = {
      length: 10,
      array: [
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0], // □ □ ■ □ □ □ □ ■ □ □
        [0, 1, 0, 1, 0, 0, 1, 0, 1, 0], // □ ■ □ ■ □ □ ■ □ ■ □
        [1, 1, 0, 1, 1, 1, 1, 0, 1, 1], // ■ ■ □ ■ ■ ■ ■ □ ■ ■
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0], // □ ■ ■ ■ □ □ ■ ■ ■ □
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0], // □ □ ■ ■ □ □ ■ ■ □ □
        [0, 1, 0, 1, 1, 1, 1, 0, 1, 0], // □ ■ □ ■ ■ ■ ■ □ ■ □
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0], // □ ■ ■ ■ □ □ ■ ■ ■ □
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 1], // ■ ■ ■ □ ■ ■ □ ■ ■ ■
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0], // □ ■ ■ ■ □ □ ■ ■ ■ □
        [0, 1, 0, 0, 1, 1, 0, 0, 1, 0], // □ ■ □ □ ■ ■ □ □ ■ □
      ],
    };
    const GAME = new Game(solution.length, solution.array);
    SCRIPT.before(header.getElement());
    SCRIPT.before(GAME.render());
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
