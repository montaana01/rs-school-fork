import './main.scss';
import BaseElementCreator from './../../factory/html/BaseElementCreator';

export default class MainView {
  private main: BaseElementCreator<'main'>;
  private mainContainer: BaseElementCreator<'div'>;
  constructor() {
    this.main = new BaseElementCreator({
      tagName: 'main',
      classNames: ['main'],
    });

    this.mainContainer = new BaseElementCreator({
      tagName: 'div',
      classNames: ['container'],
    });

    this.main.addInnerElement(this.getMainContainer());
  }
  public getMain(): HTMLElement {
    return this.main.getCreatedElement();
  }
  public getMainContainer(): HTMLElement {
    return this.mainContainer.getCreatedElement();
  }
}
