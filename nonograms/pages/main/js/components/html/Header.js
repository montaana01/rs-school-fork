import { CreateHTMLElement } from "./../CreateHTMLElement.js";
import { hardness } from "../Global.js";

export class Header {
  constructor(options) {
    this.headerElement = new CreateHTMLElement("header", options);

    const HEADER_CONTAINER = new CreateHTMLElement("div", {
      className: "container",
    });
    HEADER_CONTAINER.appendChildTo(this.headerElement.element);

    const HEADER_WRAPPER = new CreateHTMLElement("div", {
      className: "header__wrapper",
    });
    HEADER_WRAPPER.appendChildTo(HEADER_CONTAINER.element);

    const LOGO = new CreateHTMLElement("div", {
      className: "header__wrapper-item",
    });
    const LOGO_IMG = new CreateHTMLElement("img", {
      className: "header__wrapper__logo-img",
      attributes: {
        src: "./../../assets/icons/nonograms-logo.svg",
        alt: "Logo",
      },
    });
    LOGO_IMG.appendChildTo(LOGO.element);
    LOGO.appendChildTo(HEADER_WRAPPER.element);

    // todo:
    // if game started we introduce timer numbers
    //
    // const RATING = new CreateHTMLElement("div", {
    //   className: "header__wrapper-item",
    // });
    // const RATING_VALUE = new CreateHTMLElement("p", {
    //   id: "header__wrapper__rating-value",
    //   content: "0",
    // });
    // RATING_VALUE.appendChildTo(RATING.element);
    // RATING.appendChildTo(HEADER_WRAPPER.element);

    const DIFFICULTY_SWITCHER = new CreateHTMLElement("div", {
      className: "header__wrapper-item",
    });
    DIFFICULTY_SWITCHER.updateClass("header__wrapper-item__switcher");

    const SWITCHER_AREA = new CreateHTMLElement("div", {
      className: "header__wrapper-item__switcher__area",
    });

    const SWITCHER_POINT = new CreateHTMLElement("div", {
      className: "header__wrapper-item__switcher__point",
    });

    const SWITCHER_TEXT = new CreateHTMLElement("div", {
      className: "header__wrapper-item__switcher__text",
    });

    hardness.forEach((level, index) => {
      const marker = new CreateHTMLElement("div", {
        className: "header__wrapper-item__switcher__point-marker",
        attributes: {
          "data-position": index,
          "data-difficulty": level,
        },
      });
      marker.updateClass(`${index === 0 ? "active" : ""}`);

      const label = new CreateHTMLElement("p", {
        className: "header__wrapper-item__switcher__text-label",
        content: level.charAt(0).toUpperCase() + level.slice(1),
      });
      label.updateClass(` ${index === 0 ? "active" : ""}`);

      marker.element.addEventListener("click", () => {
        localStorage.setItem("difficulty", level);

        SWITCHER_POINT.element
          .querySelectorAll(".header__wrapper-item__switcher__point-marker")
          .forEach((marker) => marker.classList.remove("active"));

        SWITCHER_TEXT.element
          .querySelectorAll(".header__wrapper-item__switcher__text-label")
          .forEach((text) => text.classList.remove("active"));

        marker.element.classList.add("active");
        label.element.classList.add("active");
      });

      marker.appendChildTo(SWITCHER_POINT.element);
      label.appendChildTo(SWITCHER_TEXT.element);
    });

    SWITCHER_POINT.appendChildTo(SWITCHER_AREA.element);
    SWITCHER_AREA.appendChildTo(DIFFICULTY_SWITCHER.element);

    SWITCHER_TEXT.appendChildTo(DIFFICULTY_SWITCHER.element);
    DIFFICULTY_SWITCHER.appendChildTo(HEADER_WRAPPER.element);

    this.THEME = new CreateHTMLElement("button", {
      className: "header__wrapper-item",
      content: "Theme",
      attributes: {
        id: "theme-switcher",
      },
    });
    this.THEME.updateClass("header__wrapper-item__theme");
    this.THEME.updateClass("btn");
    this.THEME.appendChildTo(HEADER_WRAPPER.element);
  }

  getElement() {
    return this.headerElement.element;
  }

  getThemeSwitcher() {
    return this.THEME.element;
  }
}
