import { CreateHTMLElement } from "./../CreateHTMLElement.js";

export class Footer {
  constructor(options) {
    this.footerElement = new CreateHTMLElement("footer", options);

    const FOOTER_CONTAINER = new CreateHTMLElement("div", {
      className: "container",
    });
    FOOTER_CONTAINER.appendChildTo(this.footerElement.element);

    const FOOTER_WRAPPER = new CreateHTMLElement("div", {
      className: "footer__wrapper",
    });
    FOOTER_WRAPPER.appendChildTo(FOOTER_CONTAINER.element);

    const FOOTER_GITHUB = new CreateHTMLElement("img", {
      className: "footer__wrapper-item",
      attributes: {
        src: "./../../assets/icon/github.svg",
        alt: "Github icon",
      },
    });
    FOOTER_GITHUB.updateClass("link");
    FOOTER_GITHUB.element.onclick = () => {
      window.open("https://github.com/montaana01", "_blank");
    };

    const FOOTER_COPYRIGHT = new CreateHTMLElement("p", {
      className: "footer__wrapper-item",
    });
    FOOTER_COPYRIGHT.updateContent(
      `YakovlevDev © ${new Date().getFullYear()}`
    );

    const FOOTER_RSS = new CreateHTMLElement("img", {
      className: "footer__wrapper-item",
      attributes: {
        src: "./../../assets/icon/rss-logo.svg",
        alt: "Made in Rolling Scopes School",
      },
    });
    FOOTER_RSS.updateClass("link");
    FOOTER_RSS.element.onclick = () => {
      window.open("https://rs.school", "_blank");
    };

    FOOTER_GITHUB.appendChildTo(FOOTER_WRAPPER.element);
    FOOTER_COPYRIGHT.appendChildTo(FOOTER_WRAPPER.element);
    FOOTER_RSS.appendChildTo(FOOTER_WRAPPER.element);
  }

  getElement() {
    return this.footerElement.element;
  }
}
