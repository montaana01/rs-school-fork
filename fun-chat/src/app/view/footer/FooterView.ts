import './footerView.scss';

import BaseElementCreator from '../../factory/BaseElementCreator';
import ImageElementCreator from '../../factory/ImageElementCreator';

export default class FooterView {
  private footer: BaseElementCreator<'footer'>;
  private github!: BaseElementCreator<'img'>;
  private copyright!: BaseElementCreator<'p'>;
  private rss!: BaseElementCreator<'img'>;

  constructor() {
    this.footer = new BaseElementCreator({
      tagName: 'footer',
      classNames: ['footer'],
    });
    this.createView();
  }

  public getFooter(): HTMLElement {
    return this.footer.getCreatedElement();
  }

  private createView(): void {
    const container: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['container'],
    });
    const wrapper: BaseElementCreator<'div'> = this.createWrapper();

    container.addInnerElement(wrapper.getCreatedElement());
    this.footer.addInnerElement(container.getCreatedElement());
  }

  private createWrapper(): BaseElementCreator<'div'> {
    const wrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['footer', 'footer__wrapper'],
    });

    this.github = new ImageElementCreator({
      tagName: 'img',
      classNames: ['footer__wrapper-item', 'link'],
      callback: (): Window | null => window.open('https://github.com/montaana01', '_blank'),
      src: './icons/github.svg',
      alt: 'Github icon',
    });

    this.copyright = new BaseElementCreator({
      tagName: 'p',
      classNames: ['footer__wrapper-item'],
      textContent: 'YakovlevDev © 2025',
    });

    this.rss = new ImageElementCreator({
      tagName: 'img',
      classNames: ['footer__wrapper-item', 'link'],
      callback: (): Window | null => window.open('https://rs.school', '_blank'),
      src: './icons/rss-logo.svg',
      alt: 'Made in Rolling Scopes School',
    });

    wrapper.addInnerElement(this.github.getCreatedElement());
    wrapper.addInnerElement(this.copyright.getCreatedElement());
    wrapper.addInnerElement(this.rss.getCreatedElement());

    return wrapper;
  }
}
