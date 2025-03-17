import './modal.scss';
import type { SettingsType } from '../../../types/SettingsType.ts';
import View from '../../view.ts';
import HtmlElementCreator from '../../../services/htmlElementCreator.ts';

export default class ModalWindow extends View {
  private readonly modalSettings: SettingsType;
  private readonly closeButtonSettings: SettingsType;
  private readonly messageSettings: SettingsType;

  constructor(message: string) {
    const overlaySettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper-modal-overlay'],
    };
    super(overlaySettings);

    this.modalSettings = {
      tagName: 'div',
      classNames: ['main__wrapper-modal-window'],
    };
    this.closeButtonSettings = {
      tagName: 'span',
      classNames: ['main__wrapper-modal-close'],
      textContent: '×',
    };
    this.messageSettings = {
      tagName: 'div',
      classNames: ['main__wrapper-modal-message'],
      textContent: message,
    };

    this.configureView();
  }

  private configureView(): void {
    const modal: HtmlElementCreator = new HtmlElementCreator(this.modalSettings);
    const closeButton: HtmlElementCreator = new HtmlElementCreator(this.closeButtonSettings);
    const messageElement: HtmlElementCreator = new HtmlElementCreator(this.messageSettings);

    closeButton.setCallback(() => this.close());
    modal.addInnerHtmlCreatorElement(closeButton);
    modal.addInnerHtmlCreatorElement(messageElement);
    this.elementCreator.addInnerHtmlCreatorElement(modal);

    document.body.appendChild(this.elementCreator.getCreatedElement());
    setTimeout(() => this.close(), 10000);
  }

  private close(): void {
    const overlay: HTMLElement = this.elementCreator.getCreatedElement();
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }
}
