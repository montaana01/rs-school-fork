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
    LOGO_IMG.element.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("initHome"));
    });
    LOGO_IMG.appendChildTo(LOGO.element);
    LOGO.appendChildTo(HEADER_WRAPPER.element);

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

    const savedDifficulty = localStorage.getItem("difficulty") || "easy";
    hardness.forEach((level, index) => {
      const isActive = level === savedDifficulty;

      const marker = new CreateHTMLElement("div", {
        className: "header__wrapper-item__switcher__point-marker",
        attributes: {
          "data-position": index,
          "data-difficulty": level,
        },
      });
      marker.updateClass(`${isActive ? "active" : ""}`);

      const label = new CreateHTMLElement("p", {
        className: "header__wrapper-item__switcher__text-label",
        content: level.charAt(0).toUpperCase() + level.slice(1),
      });
      label.updateClass(` ${isActive ? "active" : ""}`);

      marker.element.addEventListener("click", () => {
        localStorage.setItem("difficulty", level);
        window.dispatchEvent(new CustomEvent("difficultyUpdated"));

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

    this.HAMBURGER = new CreateHTMLElement("div", {
      className: "header__wrapper-item",
    });
    this.spanTop = new CreateHTMLElement("span", {});
    this.spanMiddle = new CreateHTMLElement("span", {});
    this.spanBottom = new CreateHTMLElement("span", {});
    this.spanTop.appendChildTo(this.HAMBURGER.element);
    this.spanMiddle.appendChildTo(this.HAMBURGER.element);
    this.spanBottom.appendChildTo(this.HAMBURGER.element);

    this.HAMBURGER.element.addEventListener("click", () => {
      this.HAMBURGER.toggleClass("active");
      this.BUTTONS.toggleClass("active");
      document.body.classList.toggle("hamburger");
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.HAMBURGER.element.classList.remove("active");
        this.BUTTONS.element.classList.remove("active");
        document.body.classList.remove("hamburger");
      }
    });

    this.HAMBURGER.updateClass("header__wrapper-item__hamburger");
    this.HAMBURGER.appendChildTo(HEADER_WRAPPER.element);

    this.BUTTONS = new CreateHTMLElement("div", {
      className: "header__wrapper-item",
    });
    this.BUTTONS.updateClass("header__wrapper-item__buttons");
    this.BUTTONS.appendChildTo(HEADER_WRAPPER.element);

    this.THEME = new CreateHTMLElement("button", {
      className: "header__wrapper-item",
      content: "Theme",
      attributes: {
        id: "theme-switcher",
      },
    });
    this.THEME.updateClass("header__wrapper-item__theme");
    this.THEME.updateClass("btn");
    this.THEME.appendChildTo(this.BUTTONS.element);

    this.HOME = new CreateHTMLElement("button", {
      className: "header__wrapper-item",
      content: "Home",
    });
    this.HOME.updateClass("header__wrapper-item__home");
    this.HOME.updateClass("btn");
    this.HOME.element.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("initHome"));
    });
    this.HOME.appendChildTo(this.BUTTONS.element);

    this.SOUND = new CreateHTMLElement("button", {
      className: "header__wrapper-item__sound",
      content: "🔊",
      attributes: { id: "sound" },
    });
    this.SOUND.updateClass("btn");
    localStorage.setItem("sound", "true");
    this.SOUND.appendChildTo(this.BUTTONS.element);

    this.RESTART = new CreateHTMLElement("button", {
      className: "header__wrapper-item",
      content: "↻",
      attributes: {
        id: "restart-header",
      },
    });
    this.RESTART.updateClass("header__wrapper-item__restart");
    this.RESTART.updateClass("btn");
    this.RESTART.updateClass("hidden");
    this.RESTART.element.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("gameRestart"));
    });
    this.RESTART.appendChildTo(this.BUTTONS.element);
  }

  showRestartButton() {
    this.RESTART.element.classList.contains("hidden");
    this.RESTART.element.classList.remove("hidden");
  }

  hideRestartButton() {
    if (!this.RESTART.element.classList.contains("hidden")) {
      this.RESTART.updateClass("hidden");
    }
  }

  getElement() {
    return this.headerElement.element;
  }

  getThemeSwitcher() {
    return this.THEME.element;
  }
}
