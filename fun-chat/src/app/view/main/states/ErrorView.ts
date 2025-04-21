import BaseElementCreator from '../../../factory/BaseElementCreator.ts';

export default class ErrorView {
  public backButton!: BaseElementCreator<'button'>;
  private section: BaseElementCreator<'section'>;
  private readonly message: string;

  constructor(message: string = 'Error: 404') {
    this.section = new BaseElementCreator({
      tagName: 'section',
      classNames: ['main__wrapper'],
    });
    this.message = message;

    this.createView();
  }

  public getError(): HTMLElement {
    return this.section.getCreatedElement();
  }

  private createView(): void {
    const text: BaseElementCreator<'h2'> = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['main__wrapper-item__title'],
      textContent: this.message,
    });
    this.backButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__button', 'button', 'link'],
      textContent: 'Back',
    });
    this.section.addInnerElement(text.getCreatedElement());
    this.section.addInnerElement(this.backButton.getCreatedElement());
  }
}
