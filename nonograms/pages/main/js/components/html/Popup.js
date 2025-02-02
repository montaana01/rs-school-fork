import { CreateHTMLElement } from "./../CreateHTMLElement.js";

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

    this.button = new CreateHTMLElement("button", {
      className: this.className + "__wrapper__content-button",
      content: "repeat",
    });

    this.button.appendChildTo(this.content.element);
  }

  getPopup() {
    return this.popup;
  }
}
