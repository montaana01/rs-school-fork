import './headerView.scss';

import BaseElementCreator from '../../factory/html/BaseElementCreator';
import ImageElementCreator from '../../factory/html/ImageElementCreator';

const APP_NAME: string = 'Async Race';

export default class HeaderView {
  public themeToggle!: BaseElementCreator<'button'>;
  private header: BaseElementCreator<'header'>;
  private garageButton!: BaseElementCreator<'button'>;
  private winnersButton!: BaseElementCreator<'button'>;
  private logo!: BaseElementCreator<'img'>;
  private appName!: BaseElementCreator<'h1'>;

  constructor() {
    this.header = new BaseElementCreator({
      tagName: 'header',
      classNames: ['header'],
    });
    this.createView();
  }

  public getHeader(): HTMLElement {
    return this.header.getCreatedElement();
  }

  private createView(): void {
    const container: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['container'],
    });
    const wrapper: BaseElementCreator<'div'> = this.createWrapper();

    container.addInnerElement(wrapper.getCreatedElement());
    this.header.addInnerElement(container.getCreatedElement());
  }

  private createWrapper(): BaseElementCreator<'div'> {
    const wrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['header', 'header__wrapper'],
    });

    const buttons: BaseElementCreator<'ul'> = this.createButtons();
    const logo: BaseElementCreator<'div'> = this.createLogoView();
    this.themeToggle = new BaseElementCreator<'button'>({
      tagName: 'button',
      classNames: ['header__wrapper-item', 'header__wrapper-item-theme', 'button', 'link'],
      textContent: 'Theme',
    });

    wrapper.addInnerElement(buttons.getCreatedElement());
    wrapper.addInnerElement(logo.getCreatedElement());
    wrapper.addInnerElement(this.themeToggle.getCreatedElement());

    return wrapper;
  }

  private createLogoView(): BaseElementCreator<'div'> {
    const wrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['header__wrapper-item', 'header__wrapper-item-logo', 'link'],
    });

    this.logo = new ImageElementCreator({
      tagName: 'img',
      classNames: ['header__wrapper-item'],
      src: '/icons/app-logo.svg',
      alt: APP_NAME,
    });

    this.appName = new BaseElementCreator({
      tagName: 'h1',
      classNames: ['header__wrapper-item'],
      textContent: APP_NAME,
    });

    wrapper.addInnerElement(this.logo.getCreatedElement());
    wrapper.addInnerElement(this.appName.getCreatedElement());

    return wrapper;
  }

  private createButtons(): BaseElementCreator<'ul'> {
    const wrapper: BaseElementCreator<'ul'> = new BaseElementCreator({
      tagName: 'ul',
      classNames: ['header__wrapper-item', 'header__wrapper-item-nav'],
    });
    this.garageButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['header__wrapper-item-button', 'button', 'link'],
      textContent: 'Garage',
    });
    this.winnersButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['header__wrapper-item-button', 'button', 'link'],
      textContent: 'Winners',
    });

    wrapper.addInnerElement(this.garageButton.getCreatedElement());
    wrapper.addInnerElement(this.winnersButton.getCreatedElement());
    return wrapper;
  }
}
