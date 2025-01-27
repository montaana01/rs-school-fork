import { CreateHTMLElement } from "./../CreateHTMLElement.js";

export class Header {
  constructor(options) {
    this.headerElement = new CreateHTMLElement("header", options);

    const HEADER_CONTAINER = new CreateHTMLElement("div", {
      className: "header__container",
    });
    HEADER_CONTAINER.appendChildTo(this.headerElement.element);

    const HEADER_WRAPPER = new CreateHTMLElement("div", {
      className: "header__wrapper",
    });
    HEADER_WRAPPER.appendChildTo(HEADER_CONTAINER.element);

    const LOGO = new CreateHTMLElement("div", {
      className: "header__wrapper__logo",
    });
    const LOGO_IMG = new CreateHTMLElement("img", {
      attributes: {
        src: "./../../assets/icons/rss-logo.svg",
        alt: "Logo",
      },
    });
    LOGO_IMG.updateClass("header__wrapper__logo-img");
    LOGO_IMG.appendChildTo(LOGO.element);
    LOGO.appendChildTo(HEADER_WRAPPER.element);

    const RATING = new CreateHTMLElement("div", {
      className: "header__wrapper__rating",
    });
    const RATING_VALUE = new CreateHTMLElement("p", {
      id: "header__wrapper__rating-value",
      content: "0",
    });
    RATING_VALUE.appendChildTo(RATING.element);
    RATING.appendChildTo(HEADER_WRAPPER.element);

    const DIFFICULT = new CreateHTMLElement("div", {
      className: "header__wrapper__difficult",
    });
    const LEVELS = ["easy (5х5)", "medium (10х10)", "hard (15х15)"];

    LEVELS.forEach((difficulty) => {
      const button = new CreateHTMLElement("button", {
        className: "header__wrapper__difficulty-selector",
        attributes: { "data-difficulty": difficulty },
        content: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      });
      button.appendChildTo(DIFFICULT.element);
    });

    DIFFICULT.appendChildTo(HEADER_WRAPPER.element);

    this.THEME = new CreateHTMLElement("button", {
      className: "header__wrapper__difficulty-selector",
      content: "Theme",
      attributes: {
        id: "theme-switcher",
      },
    });
    this.THEME.appendChildTo(HEADER_WRAPPER.element);
  }

  getElement() {
    return this.headerElement.element;
  }

  getThemeSwitcher() {
    return this.THEME.element;
  }
}
