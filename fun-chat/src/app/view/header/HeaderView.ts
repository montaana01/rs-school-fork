import './headerView.scss';
import BaseElementCreator from '../../factory/BaseElementCreator';
import ImageElementCreator from '../../factory/ImageElementCreator';
import ThemeSwitcherView from './switcher/ThemeSwitcherView.ts';

export default class HeaderView {
  public logoWrapper!: BaseElementCreator<'div'>;
  public pageTitle!: BaseElementCreator<'h2'>;
  public themeSwitcher!: ThemeSwitcherView;
  private header: BaseElementCreator<'header'>;
  private logo!: BaseElementCreator<'img'>;
  private appName!: BaseElementCreator<'h1'>;
  private appDescription!: BaseElementCreator<'h2'>;
  private readonly app_name: string;

  constructor(text: string) {
    this.app_name = text
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

    this.pageTitle = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['header__wrapper-item'],
    })

    const logo: BaseElementCreator<'div'> = this.createLogoView();

    this.themeSwitcher = new ThemeSwitcherView();
    wrapper.addInnerElement(logo.getCreatedElement());
    wrapper.addInnerElement(this.pageTitle.getCreatedElement());
    wrapper.addInnerElement(this.themeSwitcher.getCreatedElement());

    return wrapper;
  }

  private createLogoView(): BaseElementCreator<'div'> {
    this.logoWrapper = new BaseElementCreator({
      tagName: 'div',
      classNames: ['header__wrapper-item', 'header__wrapper-item__logo', 'link'],
    });

    this.logo = new ImageElementCreator({
      tagName: 'img',
      classNames: ['header__wrapper-item'],
      src: './icons/app-logo.svg',
      alt: this.app_name ?? 'Application',
    });

    this.appName = new BaseElementCreator({
      tagName: 'h1',
      classNames: ['header__wrapper-item', 'hidden'],
      textContent: this.app_name ?? 'Application',
    });

    this.appDescription = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['header__wrapper-item', 'header__wrapper-item__logo'],
      textContent: 'Secure messaging',
    });

    this.logoWrapper.addInnerElement(this.logo.getCreatedElement());
    this.logoWrapper.addInnerElement(this.appName.getCreatedElement());
    this.logoWrapper.addInnerElement(this.appDescription.getCreatedElement());

    return this.logoWrapper;
  }
}
