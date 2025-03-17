import View from './../../view';
import HtmlElementCreator from './../../../services/htmlElementCreator';
import type { SettingsType } from './../../../types/SettingsType.ts';

export default class ListMainStateView extends View {
  constructor() {
    const mainWrapperSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper'],
    };

    super(mainWrapperSettings);
    this.configureView();
  }

  private configureView(): void {
    // todo: replace this with table with decisions
    const titleSettings: SettingsType = {
      tagName: 'h2',
      classNames: ['main__wrapper-item', 'main__wrapper-item__title'],
      textContent: 'List of Options Page',
    };
    this.elementCreator.addInnerHtmlCreatorElement(new HtmlElementCreator(titleSettings));

    // todo: replace this with creating block of buttons
    const startButton: SettingsType = {
      tagName: 'button',
      classNames: ['main__wrapper-item', 'main__wrapper-item__button', 'button'],
      textContent: 'Start',
      callback: (): void => {
        window.location.hash = 'decision';
      },
    };
    this.elementCreator.addInnerHtmlCreatorElement(new HtmlElementCreator(startButton));
  }
}
