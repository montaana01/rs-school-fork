import { CreateHTMLElement } from "./../CreateHTMLElement.js";
import { Carousel } from "./Carousel.js";
import { Popup } from "./Popup.js";
import { Sound } from "./../Sound.js";

export class Game {
  constructor(size = 5, solution = {}) {
    this.size = size;
    this.solution = solution;
    this.answersArray = [];
    this.answersCount = 0;
    this.cellsArray = [];
    this.isTimerRunning = false;
    this.startTime = null;
    this.isSolutionShown = false;

    this.sound = new Sound();

    this.MAIN = new CreateHTMLElement("main");
    this.GRID = new CreateHTMLElement("section", { className: "game" });
    this.GRID.appendChildTo(this.MAIN.element);

    this.GRID_CONTAINER = new CreateHTMLElement("div", {
      className: "container",
    });
    this.GRID_CONTAINER.appendChildTo(this.GRID.element);

    this.CAROUSEL_CONTAINER = new CreateHTMLElement("div", {
      className: "game__carousel",
    });
    this.CAROUSEL_CONTAINER.appendChildTo(this.GRID_CONTAINER.element);

    this.GRID_WRAPPER = new CreateHTMLElement("div", {
      className: "game__wrapper",
    });
    this.GRID_WRAPPER.appendChildTo(this.GRID_CONTAINER.element);

    this.INFO = new CreateHTMLElement("div", {
      className: "game__wrapper__info",
    });
    this.INFO.updateClass("border-right border-bottom");

    this.timer = new CreateHTMLElement("div", {
      className: "game__wrapper__info-timer",
    });

    this.ANSWERS_COLUMN = new CreateHTMLElement("div", {
      className: "game__wrapper__answers",
    });
    this.ANSWERS_COLUMN.updateClass("game__wrapper__answers-column");

    this.ANSWERS_ROW = new CreateHTMLElement("div", {
      className: "game__wrapper__answers",
    });
    this.ANSWERS_ROW.updateClass("game__wrapper__answers-row");

    this.FIELD = new CreateHTMLElement("div", {
      className: "game__wrapper__field",
    });

    this.GAME_BUTTONS = new CreateHTMLElement("div", {
      className: "game__wrapper__buttons",
    });

    this.SOLUTION = new CreateHTMLElement("button", {
      className: "game__wrapper__solution",
      content: "Show Solution",
    });
    this.SOLUTION.updateClass("btn");
    this.SOLUTION.element.addEventListener("click", () => {
      this.showSolution();
      localStorage.setItem(`cheated`, "true");
      this.isSolutionShown = true;
    });

    this.SAVE = new CreateHTMLElement("button", {
      className: "game__wrapper__save",
      content: "Save game",
    });
    this.SAVE.updateClass("btn");
    this.SAVE.element.addEventListener("click", () => {
      this.saveGame();
    });

    this.SOLUTION.appendChildTo(this.GAME_BUTTONS.element);
    this.SAVE.appendChildTo(this.GAME_BUTTONS.element);

    this.INFO.appendChildTo(this.GRID_WRAPPER.element);
    this.ANSWERS_COLUMN.appendChildTo(this.GRID_WRAPPER.element);
    this.ANSWERS_ROW.appendChildTo(this.GRID_WRAPPER.element);
    this.FIELD.appendChildTo(this.GRID_WRAPPER.element);
  }

  render() {
    this.isSolutionShown = false;
    if (this.solution.length > 0) {
      this.renderAnswersColumn();
      this.renderAnswersRow();
    }
    this.renderField();
    this.timer.appendChildTo(this.INFO.element);
    return this.MAIN.element;
  }

  renderAnswersColumn() {
    this.answersArray = [];
    this.answersCount = 0;

    for (let col = 0; col < this.size; col += 1) {
      const answers = this.getColumnAnswers(col);
      this.answersArray.push(answers);

      if (answers.length > this.answersCount) {
        this.answersCount = answers.length;
      }
    }

    for (let col = 0; col < this.size; col += 1) {
      const answers = this.answersArray[col];
      const answerColumnCollection = new CreateHTMLElement("div", {
        className: `game__wrapper__answers-collection-column`,
      });

      for (let i = this.answersCount - 1; i >= 0; i -= 1) {
        const answerCell = new CreateHTMLElement("p", {
          className: "game__wrapper__answers-cell",
          content: i < answers.length ? answers[i] : "",
        });

        if ((col + 1) % 5 === 0 && col !== this.size - 1) {
          answerCell.updateClass("border-right");
        }
        answerCell.appendChildTo(answerColumnCollection.element);
      }
      answerColumnCollection.appendChildTo(this.ANSWERS_COLUMN.element);
    }
  }

  renderAnswersRow() {
    this.answersArray = [];
    this.answersCount = 0;
    for (let row = 0; row < this.size; row += 1) {
      const answers = this.getRowAnswers(row);
      this.answersArray.push(answers);

      if (answers.length > this.answersCount) {
        this.answersCount = answers.length;
      }
    }

    for (let row = 0; row < this.size; row += 1) {
      const answers = this.answersArray[row];
      const answerRowCollection = new CreateHTMLElement("div", {
        className: `game__wrapper__answers-collection-row`,
      });
      for (let i = this.answersCount - 1; i >= 0; i -= 1) {
        const answerCell = new CreateHTMLElement("p", {
          className: "game__wrapper__answers-cell",
          content: i < answers.length ? answers[i] : "",
        });

        if ((row + 1) % 5 === 0 && row !== this.size - 1) {
          answerCell.updateClass("border-bottom");
        }
        answerCell.appendChildTo(answerRowCollection.element);
      }
      answerRowCollection.appendChildTo(this.ANSWERS_ROW.element);
    }
  }

  renderField() {
    this.cellsArray = [];
    for (let row = 0; row < this.size; row += 1) {
      const rowDiv = new CreateHTMLElement("div", {
        className: "game__wrapper__field-row",
      });
      this.cellsArray[row] = [];
      for (let col = 0; col < this.size; col += 1) {
        const cell = new CreateHTMLElement("span", {
          className: "game__wrapper__field-cell",
        });
        this.cellsArray[row][col] = cell.element;
        if ((col + 1) % 5 === 0 && col !== this.size - 1) {
          cell.updateClass("border-right");
        }
        if ((row + 1) % 5 === 0 && row !== this.size - 1) {
          cell.updateClass("border-bottom");
        }
        cell.element.addEventListener("contextmenu", (e) => {
          e.preventDefault();
        });
        cell.element.addEventListener("mousedown", (e) => {
          if (e.button === 2) {
            e.preventDefault();
            this.sound.play("cross");
            if (!this.isTimerRunning) this.startTimer();
            cell.element.classList.remove("black");
            cell.toggleClass("crossed");
            this.checkSolution();
          }
        });
        cell.element.addEventListener("click", () => {
          if (!this.isTimerRunning && !this.isSolutionShown) {
            this.GAME_BUTTONS.appendChildTo(this.GRID_CONTAINER.element);
            this.startTimer();
          }
          cell.element.classList.contains("black")
            ? this.sound.play("remove")
            : this.sound.play("click");
          cell.element.classList.remove("crossed");
          cell.element.classList.remove("solution");
          cell.toggleClass("black");
          this.checkSolution();
        });
        cell.appendChildTo(rowDiv.element);
      }
      rowDiv.appendChildTo(this.FIELD.element);
    }
  }

  getColumnAnswers(col) {
    const answers = [];
    let count = 0;
    for (let row = 0; row < this.size; row += 1) {
      if (this.solution[row][col] === 1) {
        count += 1;
      } else if (count > 0) {
        answers.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      answers.push(count);
    }
    return answers.length > 0 ? answers : [0];
  }

  getRowAnswers(row) {
    const answers = [];
    let count = 0;
    for (let col = 0; col < this.size; col += 1) {
      if (this.solution[row][col] === 1) {
        count += 1;
      } else if (count > 0) {
        answers.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      answers.push(count);
    }
    return answers.length > 0 ? answers : [0];
  }

  checkSolution() {
    let isCorrect = true;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this.cellsArray[row][col];
        const isBlack = cell.classList.contains("black");
        const shouldBeBlack = this.solution[row][col] === 1;

        if (isBlack !== shouldBeBlack) {
          isCorrect = false;
        }
      }
    }

    if (isCorrect) {
      this.showFinalMessage();
    }
  }

  startTimer(initialTime = 0) {
    document.getElementById("restart-header").classList.remove("hidden");
    this.startTime = Date.now() - initialTime;
    this.isTimerRunning = true;
    this.updateTimer();
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.timer.updateContent(
      `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, "0")}`
    );
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;
  }

  showCarousel(solutions) {
    if (this.carousel) {
      window.removeEventListener(
        "difficultyUpdated",
        this.carousel.updateCarousel
      );
    }
    this.GRID_WRAPPER.element.remove();
    this.SOLUTION.element.remove();
    this.carousel = new Carousel(solutions);
    this.carousel.getElement().appendChildTo(this.CAROUSEL_CONTAINER.element);
    return this.carousel;
  }

  showFinalMessage() {
    const solveTime = Math.floor((Date.now() - this.startTime) / 1000);
    this.stopTimer();
    this.sound.play("win");
    const minutes = Math.floor(solveTime / 60);
    const seconds = solveTime % 60;
    const solveTimeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    let finalPopUp;
    if (this.isSolutionShown) {
      finalPopUp = new Popup(
        "popup",
        `You use solution button! You solved it, but this result is off the charts!`
      );
    } else {
      finalPopUp = new Popup(
        "popup",
        `Great! You solved it in ${solveTimeString}!`
      );
    }
    localStorage.setItem("solveTime", solveTimeString);
    finalPopUp.getPopup().appendChildTo(this.MAIN.element);
  }

  showMessage(message) {
    const solveTime = Math.floor((Date.now() - this.startTime) / 1000);
    this.stopTimer();
    this.sound.play("click");
    const minutes = Math.floor(solveTime / 60);
    const seconds = solveTime % 60;
    const solveTimeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    this.messagePopup = new Popup(
      "popup",
      `${message}\nSaved time is ${solveTimeString}!`
    );
    this.messagePopup.getPopup().appendChildTo(this.MAIN.element);
  }

  showSolution() {
    this.solution.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 1) this.cellsArray[i][j].classList.add("solution");
      });
    });
    this.isSolutionShown = true;
    this.stopTimer();
    this.SOLUTION.element.remove();
    this.SAVE.element.remove();
  }

  saveGame() {
    const state = {
      cells: this.cellsArray.map((row) =>
        row.map((cell) => ({
          B: cell.classList.contains("black"),
          X: cell.classList.contains("crossed"),
        }))
      ),
      difficult: localStorage.getItem("difficulty"),
      levelName: localStorage.getItem("currentLevel"),
      solution: this.solution,
      timer: Date.now() - this.startTime,
    };
    localStorage.setItem("game", JSON.stringify(state));
    this.showMessage("Great! You have been saved this game!");
  }

  loadSavedGame() {
    const state = JSON.parse(localStorage.getItem("game"));
    this.solution = state.solution;
    this.GAME_BUTTONS.appendChildTo(this.GRID_CONTAINER.element);

    state.cells.forEach((row, i) => {
      row.forEach((cellState, j) => {
        const cell = this.cellsArray[i][j];
        if (cellState.B) cell.classList.add("black");
        else cell.classList.remove("black");
        if (cellState.X) cell.classList.add("crossed");
        else cell.classList.remove("crossed");
      });
    });

    this.startTimer(state.timer);

    this.isSolutionShown = state.isSolutionShown;
    if (this.isSolutionShown) this.showSolution();
  }
}
