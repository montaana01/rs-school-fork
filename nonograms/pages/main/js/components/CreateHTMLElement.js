export class CreateHTMLElement {
  constructor(tag, options = {}) {
    this.element = document.createElement(tag);

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        this.element.setAttribute(key, value);
      });
    }

    if (options.content) {
      this.element.textContent = options.content;
    }

    if (options.className) {
      this.element.classList.add(options.className);
    }
  }

  appendChildTo(parent) {
    parent.appendChild(this.element);
  }

  updateAttributes(newAttributes) {
    Object.entries(newAttributes).forEach(([key, value]) => {
      this.element.setAttribute(key, value);
    });
  }

  updateContent(newContent) {
    this.element.textContent = newContent;
  }

  updateClass(newClassName) {
    this.element.className = newClassName;
  }
}
