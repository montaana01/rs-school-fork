import './mainView.scss'
import BaseElementCreator from '../../factory/BaseElementCreator.ts';

export default class MainView {
  public main: BaseElementCreator<'main'>;
  private container!: BaseElementCreator<'div'>

  constructor() {
    this.main = new BaseElementCreator({
      tagName: 'main',
      classNames: ['main'],
    });
    this.createView();
  }

  public getMain(): HTMLElement {
    return this.main.getCreatedElement();
  }

  public getContainer(): BaseElementCreator<'div'> {
    return this.container;
  }

  private createView(): void {
    this.container = new BaseElementCreator({
      tagName: 'div',
      classNames: ['container'],
    });

    this.main.addInnerElement(this.container.getCreatedElement());
  }
}
