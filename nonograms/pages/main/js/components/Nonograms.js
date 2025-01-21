export class Nonograms {
  constructor(difficult) {
    this.difficult = difficult;
  }

  start() {
    //here some code for starting game
    console.log(`Starting nonograms with difficult "${this.difficult}"`);
  }

  pause() {
    //here code for pause
    console.log("Paused nonograms");
  }

  finish() {
    //here call to finish screen with stats
    console.log("Finished nonograms");
  }
}
