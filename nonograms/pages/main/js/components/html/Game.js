import { CreateHTMLElement } from "./../CreateHTMLElement.js";

export class Game {
  constructor(size = 5, solution = []) {
    this.size = size;
    this.solution = solution;
    this.answersArray = [];
    this.answersCount = 0;
    this.MAIN = new CreateHTMLElement("main");
    this.GRID = new CreateHTMLElement("section", { className: "game" });
    this.GRID.appendChildTo(this.MAIN.element);

    this.GRID_CONTAINER = new CreateHTMLElement("div", {
      className: "container",
    });
    this.GRID_CONTAINER.appendChildTo(this.GRID.element);

    this.GRID_WRAPPER = new CreateHTMLElement("div", {
      className: "game__wrapper",
    });
    this.GRID_WRAPPER.appendChildTo(this.GRID_CONTAINER.element);

    this.INFO = new CreateHTMLElement("div", {
      className: "game__wrapper__info",
    });
    this.INFO.updateClass("border-right border-bottom");

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
    for (let row = 0; row < this.size; row += 1) {
      const rowDiv = new CreateHTMLElement("div", {
        className: "game__wrapper__field-row",
      });
      for (let col = 0; col < this.size; col += 1) {
        const cell = new CreateHTMLElement("span", {
          className: "game__wrapper__field-cell",
        });
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
          //todo maybe add checking solution?
          if (e.button === 2) {
            e.preventDefault();
            cell.element.classList.remove("black");
            cell.toggleClass("crossed");
          }
        });
        cell.element.addEventListener("click", () => {
          this.checkSolution();
          cell.element.classList.remove("crossed");
          cell.toggleClass("black");
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
    //todo add sound effect to advanced level
    // here some code
  }
}
