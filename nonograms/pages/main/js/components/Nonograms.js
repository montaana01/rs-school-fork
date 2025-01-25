import { Header } from "./html/Header.js";

export class Nonograms {
  constructor(difficult) {
    this.difficult = difficult;
  }

  start() {
    //here some code for starting game
    const header = new Header();
    document.body.appendChild(header.getElement());
  }

  pause() {
    //here code for pause
  }

  finish() {
    //here call to finish screen with stats
  }
}
