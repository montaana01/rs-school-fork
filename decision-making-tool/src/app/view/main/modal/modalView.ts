import './modal.scss';
import type { SettingsType } from '../../../types/SettingsType';
import View from '../../view';
import HtmlElementCreator from '../../../services/htmlElementCreator';

export default class ModalWindow extends View {
  protected readonly modalSettings: SettingsType;
  protected readonly closeButtonSettings: SettingsType;
  protected readonly messageSettings: SettingsType;
  private readonly autoClose: boolean;

  constructor(message: string, autoClose = true) {
    const overlaySettings: SettingsType = {
      tagName: 'dialog',
      classNames: ['main__wrapper-modal-overlay'],
    };
    super(overlaySettings);

    this.modalSettings = {
      tagName: 'form',
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

    this.autoClose = autoClose;

    this.configureView();
  }

  protected configureView(): void {
    document.body.classList.add('fixed');
    const modal: HtmlElementCreator = new HtmlElementCreator(this.modalSettings);
    const closeButton: HtmlElementCreator = new HtmlElementCreator(this.closeButtonSettings);
    const messageElement: HtmlElementCreator = new HtmlElementCreator(this.messageSettings);

    closeButton.setCallback(() => this.close());
    modal.addInnerHtmlCreatorElement(closeButton);
    modal.addInnerHtmlCreatorElement(messageElement);
    this.elementCreator.addInnerHtmlCreatorElement(modal);

    const overlay = this.elementCreator.getCreatedElement();
    if (!(overlay instanceof HTMLDialogElement)) {
      throw new Error('Overlay element is not a dialog');
    }
    document.body.appendChild(overlay);

    overlay.showModal();

    document.addEventListener('keydown', this.handleEscape);
    overlay.addEventListener('click', this.handleOutsideClick);

    if (this.autoClose) {
      setTimeout(() => this.close(), 10000);
    }
  }

  protected handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  protected handleOutsideClick = (event: MouseEvent): void => {
    if (event.target === this.elementCreator.getCreatedElement()) {
      this.close();
    }
  };

  protected close(): void {
    document.body.classList.remove('fixed');
    const overlay: HTMLElement = this.elementCreator.getCreatedElement();
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }
}
