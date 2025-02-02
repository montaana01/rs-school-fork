import { CreateHTMLElement } from "./../CreateHTMLElement.js";
import { Carousel } from "./Carousel.js";
import { Popup } from "./Popup.js";

export class Game {
  constructor(size = 5, solution = {}) {
    this.size = size;
    this.solution = solution;
    this.answersArray = [];
    this.answersCount = 0;
    this.cellsArray = [];
    this.isTimerRunning = false;
    this.startTime = null;

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

    this.INFO.appendChildTo(this.GRID_WRAPPER.element);
    this.ANSWERS_COLUMN.appendChildTo(this.GRID_WRAPPER.element);
    this.ANSWERS_ROW.appendChildTo(this.GRID_WRAPPER.element);
    this.FIELD.appendChildTo(this.GRID_WRAPPER.element);
  }

  render() {
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
            if (!this.isTimerRunning) this.startTimer();
            cell.element.classList.remove("black");
            cell.toggleClass("crossed");
            this.checkSolution();
          }
        });
        cell.element.addEventListener("click", () => {
          if (!this.isTimerRunning) this.startTimer();
          cell.element.classList.remove("crossed");
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

  //todo write method that check your answer!!
  checkSolution() {
    let isCorrect = true;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = this.cellsArray[row][col];
        const isBlack = cell.classList.contains("black");
        const shouldBeBlack = this.solution[row][col] === 1;

        if (isBlack !== shouldBeBlack) {
          isCorrect = false;
          //todo: add bad sound if all right answers get and solution doesn't done!
        }
      }
    }

    if (isCorrect) {
      //todo add sound effect to advanced level
      this.showFinalMessage();
    }
  }

  startTimer() {
    this.startTime = Date.now();
    this.isTimerRunning = true;
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
    this.carousel = new Carousel(solutions);
    this.carousel.getElement().appendChildTo(this.CAROUSEL_CONTAINER.element);
    return this.carousel;
  }

  showFinalMessage() {
    const solveTime = Math.floor((Date.now() - this.startTime) / 1000);
    this.stopTimer();
    const minutes = Math.floor(solveTime / 60);
    const seconds = solveTime % 60;
    const solveTimeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const finalPopUp = new Popup(
      "popup",
      `Great! You solved it in ${solveTimeString}!`
    );
    localStorage.setItem("solveTime", solveTimeString);
    finalPopUp.getPopup().appendChildTo(this.MAIN.element);
  }
}
