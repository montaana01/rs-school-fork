import './headerView.scss';
import BaseElementCreator from '../../factory/BaseElementCreator';
import ImageElementCreator from '../../factory/ImageElementCreator';
import ThemeSwitcherView from './switcher/ThemeSwitcherView.ts';

const APP_DESCRIPTION: string = 'Secure messaging';

export default class HeaderView {
  public logoWrapper!: BaseElementCreator<'div'>;
  public headerGreetings!: BaseElementCreator<'h2'>;
  public themeSwitcher!: ThemeSwitcherView;
  private header: BaseElementCreator<'header'>;
  private logo!: BaseElementCreator<'img'>;
  private appName!: BaseElementCreator<'h1'>;
  private appDescription!: BaseElementCreator<'h2'>;
  private logoutButton!: BaseElementCreator<'button'>;
  private userName: string;
  private readonly app_name: string;

  constructor(text: string) {
    this.app_name = text
    this.userName = 'Unregistered user';
    this.header = new BaseElementCreator({
      tagName: 'header',
      classNames: ['header'],
    });
    this.createView();
  }

  public getHeader(): HTMLElement {
    return this.header.getCreatedElement();
  }

  public updateHeaderGreetings(name: string = 'Guest'): void {
    this.userName = name;
    this.headerGreetings.setTextContent(`Hello ${this.userName}!`);
  }

  public showLogout(): void {
    this.logoutButton.removeClassNames(['hidden']);
  }

  public hideLogout(): void {
    this.logoutButton.setClassNames(['hidden']);
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
      classNames: ['header__wrapper'],
    });

    const greeting: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['header__wrapper-item', 'header__wrapper-item__greeting'],
    });
    greeting.addInnerElement(this.createGreeting().getCreatedElement());

    const logo: BaseElementCreator<'div'> = this.createLogoView();
    const buttonsSection: BaseElementCreator<'div'> = this.createSideButtonsView();

    wrapper.addInnerElement(logo.getCreatedElement());
    wrapper.addInnerElement(greeting.getCreatedElement());
    wrapper.addInnerElement(buttonsSection.getCreatedElement());

    return wrapper;
  }

  private createLogoView(): BaseElementCreator<'div'> {
    this.logoWrapper = new BaseElementCreator({
      tagName: 'div',
      classNames: ['header__wrapper-item', 'header__wrapper-item__logo', 'link'],
    });

    this.logo = new ImageElementCreator({
      tagName: 'img',
      classNames: ['header__wrapper-item__logo-img'],
      src: './icons/app-logo.svg',
      alt: this.app_name ?? 'Application',
    });

    this.appName = new BaseElementCreator({
      tagName: 'h1',
      classNames: ['header__wrapper-item__logo', 'hidden'],
      textContent: this.app_name ?? 'Application',
    });

    this.appDescription = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['header__wrapper-item__logo'],
      textContent: APP_DESCRIPTION,
    });

    this.logoWrapper.addInnerElement(this.logo.getCreatedElement());
    this.logoWrapper.addInnerElement(this.appName.getCreatedElement());
    this.logoWrapper.addInnerElement(this.appDescription.getCreatedElement());

    return this.logoWrapper;
  }

  private createGreeting(): BaseElementCreator<'h2'> {
    this.headerGreetings = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['header__wrapper-item__greeting-item'],
      textContent: `Hello, ${this.userName}!`,
    })
    return this.headerGreetings;
  }

  private createSideButtonsView(): BaseElementCreator<'div'> {
    const leftButtonsWrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['header__wrapper-item', 'header__wrapper-item__buttons'],
    })
    this.themeSwitcher = new ThemeSwitcherView();
    this.logoutButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['header__wrapper-item__buttons-item', 'header__wrapper-item__buttons-logout', 'button', 'link', 'hidden'],
      textContent: `LOG OUT`,
    })
    leftButtonsWrapper.addInnerElement(this.themeSwitcher.getCreatedElement());
    leftButtonsWrapper.addInnerElement(this.logoutButton.getCreatedElement());

    return leftButtonsWrapper;
  }
}
