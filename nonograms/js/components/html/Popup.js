import { CreateHTMLElement } from "../CreateHTMLElement.js";

export class Popup {
  constructor(className, text) {
    this.className = className;
    this.text = text;
    this.popup = new CreateHTMLElement("div", {
      className: this.className,
    });
    this.wrapper = new CreateHTMLElement("div", {
      className: this.className + "__wrapper",
    });

    this.wrapper.appendChildTo(this.popup.element);

    this.popupHeader = new CreateHTMLElement("div", {
      className: this.className + "__wrapper__header",
    });

    this.close = new CreateHTMLElement("button", {
      className: this.className + "__wrapper__header-close",
    });
    this.close.updateClass(`${this.className}__wrapper__header-button`);
    this.close.appendChildTo(this.popupHeader.element);
    this.close.element.addEventListener("click", () => {
      this.popup.element.remove();
    });

    this.minimize = new CreateHTMLElement("button", {
      className: this.className + "__wrapper__header-minimize",
    });
    this.minimize.updateClass(`${this.className}__wrapper__header-button`);
    this.minimize.appendChildTo(this.popupHeader.element);

    this.minimize.element.addEventListener("click", () => {
      this.wrapper.toggleClass("minimize");
    });

    this.popupHeader.appendChildTo(this.wrapper.element);

    this.content = new CreateHTMLElement("div", {
      className: this.className + "__wrapper__content",
    });

    this.content.appendChildTo(this.wrapper.element);

    this.message = new CreateHTMLElement("p", {
      className: this.className + "__wrapper__content-message",
      content: this.text,
    });

    this.message.appendChildTo(this.content.element);

    this.rating = new CreateHTMLElement("div", {
      className: this.className + "__wrapper__content-rating",
      content: "TOP-5 RATING ▼",
    });
    this.rating.element.addEventListener("click", () => this.toggleRating());
    this.rating.appendChildTo(this.content.element);

    this.table = new CreateHTMLElement("div", {
      className: this.className + "__wrapper__content-table",
    });
    this.table.updateClass("hidden");
    this.table.appendChildTo(this.content.element);

    this.restartButton = new CreateHTMLElement("button", {
      className: this.className + "__wrapper__content-button",
      content: "restart",
    });
    this.restartButton.element.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("gameRestart"));
    });

    this.restartButton.appendChildTo(this.content.element);
    this.loadRating();
  }

  toggleRating() {
    this.table.toggleClass("hidden");
    this.rating.element.textContent = this.table.element.classList.contains(
      "hidden"
    )
      ? "TOP-5 RATING ▼"
      : "TOP-5 RATING ▲";
  }

  loadRating() {
    const results = JSON.parse(localStorage.getItem("results") || "[]");

    const table = new CreateHTMLElement("table");
    const headerRow = new CreateHTMLElement("tr");
    ["#", "Level Name", "Difficulty", "Time"].forEach((text) => {
      const th = new CreateHTMLElement("th", { content: text });
      th.appendChildTo(headerRow.element);
    });
    headerRow.appendChildTo(table.element);

    results.forEach((result, index) => {
      const row = new CreateHTMLElement("tr");
      const numberCell = new CreateHTMLElement("td", {
        content: index + 1,
      });
      numberCell.appendChildTo(row.element);
      const nameCell = new CreateHTMLElement("td", {
        content: result.name,
      });
      nameCell.appendChildTo(row.element);

      const difficultyCell = new CreateHTMLElement("td", {
        content: result.difficulty,
      });
      difficultyCell.appendChildTo(row.element);

      const timeCell = new CreateHTMLElement("td", {
        content: result.time,
      });
      timeCell.appendChildTo(row.element);

      row.appendChildTo(table.element);
    });

    this.table.element.textContent = "";
    table.appendChildTo(this.table.element);
  }

  getPopup() {
    return this.popup;
  }
}
