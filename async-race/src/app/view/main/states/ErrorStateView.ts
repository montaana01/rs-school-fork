import BaseElementCreator from '../../../factory/html/BaseElementCreator.ts';

export default class ErrorStateView {
  public homeButton!: BaseElementCreator<'button'>;
  private container: BaseElementCreator<'div'>;
  private section: BaseElementCreator<'section'>;
  private readonly message: string;

  constructor(message: string = 'Error: 404') {
    this.container = new BaseElementCreator({
      tagName: 'div',
      classNames: ['container'],
    });
    this.section = new BaseElementCreator({
      tagName: 'section',
      classNames: ['main__wrapper'],
    });
    this.container.addInnerElement(this.section.getCreatedElement());
    this.message = message;

    this.createView();
  }

  public getError(): HTMLElement {
    return this.container.getCreatedElement();
  }

  private createView(): void {
    const text: BaseElementCreator<'p'> = new BaseElementCreator({
      tagName: 'p',
      classNames: ['main__wrapper-item__title'],
      textContent: this.message,
    });
    this.homeButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__button', 'button', 'link'],
      textContent: 'Home',
    });
    this.section.addInnerElement(text.getCreatedElement());
    this.section.addInnerElement(this.homeButton.getCreatedElement());
  }
}
