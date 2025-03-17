import './footerView.scss';
import type { SettingsType } from '../../types/SettingsType.ts';
import View from '../view.ts';
import HtmlElementCreator from '../../services/htmlElementCreator.ts';
import { HtmlImgElementCreator } from '../../services/htmlImgElementCreator.ts';

export default class FooterView extends View {
  public readonly githubSettings: SettingsType;
  public readonly copyrightSettings: SettingsType;
  public readonly rssSettings: SettingsType;

  constructor() {
    const footerSettings: SettingsType = {
      tagName: 'footer',
      classNames: ['footer'],
      callback: null,
    };
    super(footerSettings);

    this.githubSettings = {
      tagName: 'img',
      classNames: ['footer__wrapper-item', 'link'],
      callback: (): Window | null => window.open('https://github.com/montaana01', '_blank'),
      src: './icons/github.svg',
      alt: 'Github icon',
    };

    this.copyrightSettings = {
      tagName: 'p',
      classNames: ['footer__wrapper-item', 'link'],
      textContent: `YakovlevDev © ${new Date().getFullYear()}`,
      callback: (): Window | null => window.open('https://github.com/montaana01', '_blank'),
    };

    this.rssSettings = {
      tagName: 'img',
      classNames: ['footer__wrapper-item', 'link'],
      callback: (): Window | null => window.open('https://rs.school', '_blank'),
      src: './icons/rss-logo.svg',
      alt: 'Made in Rolling Scopes School',
    };
    this.configureView();
  }

  private configureView(): void {
    const containerSettings: SettingsType = {
      tagName: 'div',
      classNames: ['container'],
    };
    const container: HtmlElementCreator = new HtmlElementCreator(containerSettings);
    this.elementCreator.addInnerHtmlCreatorElement(container);

    const wrapperSettings: SettingsType = {
      tagName: 'div',
      classNames: ['footer', 'footer__wrapper'],
    };

    const wrapper: HtmlElementCreator = new HtmlElementCreator(wrapperSettings);
    container.addInnerHtmlCreatorElement(wrapper);

    const github: HtmlElementCreator = this.getFooterGithubElement();
    wrapper.addInnerHtmlCreatorElement(github);
    const copyright: HtmlElementCreator = this.getFooterCopyrightElement();
    wrapper.addInnerHtmlCreatorElement(copyright);
    const rss: HtmlElementCreator = this.getFooterRssElement();
    wrapper.addInnerHtmlCreatorElement(rss);
  }

  private getFooterGithubElement(): HtmlElementCreator {
    return new HtmlImgElementCreator(this.githubSettings);
  }

  private getFooterCopyrightElement(): HtmlElementCreator {
    return new HtmlElementCreator(this.copyrightSettings);
  }
  private getFooterRssElement(): HtmlElementCreator {
    return new HtmlImgElementCreator(this.rssSettings);
  }
}
