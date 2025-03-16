import './headerView.scss';
import type { SettingsType } from '../../types/SettingsType.ts';
import View from '../view.ts';
import HtmlElementCreator from '../../services/htmlElementCreator.ts';

export default class HeaderView extends View {
  constructor() {
    const headerSettings: SettingsType = {
      tagName: 'header',
      classNames: ['header'],
      callback: null,
    };
    super(headerSettings);
    this.configureView();
  }
  public configureView(): void {
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

    const itemSettings: SettingsType = {
      tagName: 'div',
      classNames: ['header__wrapper-item'],
      textContent: 'Decision making tool',
    };

    const item: HtmlElementCreator = new HtmlElementCreator(itemSettings);
    wrapper.addInnerHtmlCreatorElement(item);
  }
}
