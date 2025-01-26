import { Header } from "./html/Header.js";
import { Footer } from "./html/Footer.js";

export class Nonograms {
  constructor(difficult) {
    this.difficult = difficult;
  }

  start() {
    //here some code for starting game
    const SCRIPT = document.body.querySelector("script");
    const header = new Header();
    const footer = new Footer();
    SCRIPT.before(header.getElement());
    SCRIPT.before(footer.getElement());
  }

  pause() {
    //here code for pause
  }

  finish() {
    //here call to finish screen with stats
  }
}
