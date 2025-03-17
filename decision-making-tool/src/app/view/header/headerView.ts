import './headerView.scss';
import type { SettingsType } from '../../types/SettingsType.ts';
import View from '../view.ts';
import HtmlElementCreator from '../../services/htmlElementCreator.ts';
import { HtmlImgElementCreator } from '../../services/htmlImgElementCreator.ts';
import ButtonView from '../basicElements/buttonView.ts';
import Theme from '../theme.ts';

export default class HeaderView extends View {
  private readonly headerLogoSettings: SettingsType;

  constructor() {
    const headerSettings: SettingsType = {
      tagName: 'header',
      classNames: ['header'],
      callback: null,
    };
    super(headerSettings);

    this.headerLogoSettings = {
      tagName: 'img',
      classNames: ['header__wrapper-item'],
      callback: (): Window | null => window.open('./'),
      src: './icons/decision-making-tool.png',
      alt: 'Decision Making Tool',
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
      classNames: ['header__wrapper'],
    };

    const wrapper: HtmlElementCreator = new HtmlElementCreator(wrapperSettings);
    container.addInnerHtmlCreatorElement(wrapper);

    const headerLogo: HtmlImgElementCreator = this.getHeaderLogoElement();
    wrapper.addInnerHtmlCreatorElement(headerLogo);

    const headerTitleSettings: SettingsType = {
      tagName: 'h1',
      classNames: ['header__wrapper-item'],
      textContent: 'Decision making tool',
    };

    const headerTitle: HtmlElementCreator = new HtmlElementCreator(headerTitleSettings);
    wrapper.addInnerHtmlCreatorElement(headerTitle);

    const headerThemeButton = new ButtonView(
      'theme',
      () => {
        const theme: Theme = new Theme();
        theme.toggleTheme();
      },
      ['header__wrapper-item'],
    );

    wrapper.addInnerHtmlElement(headerThemeButton.getHTMLElement());
  }

  private getHeaderLogoElement(): HtmlImgElementCreator {
    return new HtmlImgElementCreator(this.headerLogoSettings);
  }
}
