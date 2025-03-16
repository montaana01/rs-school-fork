import View from '../view.ts';
import type { SettingsType } from '../../types/SettingsType.ts';
import decisionMakingToolLogo from '/icons/decision-making-tool.png';
import HtmlElementCreator from '../../services/htmlElementCreator.ts';
import { HtmlImgElementCreator } from '../../services/htmlImgElementCreator.ts';

export default class MainView extends View {
  private readonly imageSettings: SettingsType;

  constructor() {
    const mainSettings: SettingsType = {
      tagName: 'main',
      classNames: ['main'],
    };
    super(mainSettings);
    this.imageSettings = {
      tagName: 'img',
      classNames: ['main__wrapper-item', 'logo'],
      src: decisionMakingToolLogo,
      alt: 'Vite logo',
    };
    this.configureView();
  }

  public configureView(): void {
    const containerSettings: SettingsType = {
      tagName: 'div',
      classNames: ['container'],
    };
    const container: HtmlElementCreator = new HtmlElementCreator(containerSettings);
    this.elementCreator.addInnerHtmlCreatorElement(container);

    const mainWrapperSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper'],
    };

    const wrapper: HtmlElementCreator = new HtmlElementCreator(mainWrapperSettings);
    container.addInnerHtmlCreatorElement(wrapper);

    //todo: replace this with creating block of buttons and table with decisions
    //todo: implement anchors class
    const image: HtmlElementCreator = this.getImageElement();
    wrapper.addInnerHtmlCreatorElement(image);
  }

  public getImageElement(): HtmlElementCreator {
    return new HtmlImgElementCreator(this.imageSettings);
  }
}
