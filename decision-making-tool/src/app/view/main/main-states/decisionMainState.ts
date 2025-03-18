import View from './../../view';
import HtmlElementCreator from './../../../services/htmlElementCreator';
import type { SettingsType } from '../../../types/SettingsType.ts';

export default class DecisionMainStateView extends View {
  constructor() {
    const mainWrapperSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper'],
    };

    super(mainWrapperSettings);
    this.configureView();
  }

  private configureView(): void {
    // todo: replace this with decision round picked
    const errorTitleSettings: SettingsType = {
      tagName: 'h2',
      classNames: ['main__wrapper-item', 'main__wrapper-item__title'],
      textContent: 'Decision Picker Page',
    };
    this.elementCreator.addInnerHtmlCreatorElement(new HtmlElementCreator(errorTitleSettings));

    const backToListButton: SettingsType = {
      tagName: 'button',
      classNames: ['main__wrapper-item', 'main__wrapper-item__button', 'button'],
      textContent: 'Go to decision list page',
      callback: (): void => {
        window.location.hash = '#/list';
      },
    };

    this.elementCreator.addInnerHtmlCreatorElement(new HtmlElementCreator(backToListButton));
  }
}
