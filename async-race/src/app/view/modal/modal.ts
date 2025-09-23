import './modal.scss';
import BaseElementCreator from '../../factory/html/BaseElementCreator.ts';

export default class Modal {
  public modal: BaseElementCreator<'dialog'>;

  protected readonly message: string;
  private readonly autoClose: boolean;

  constructor(message: string, autoClose: boolean = true) {
    this.modal = new BaseElementCreator<'dialog'>({
      tagName: 'dialog',
      classNames: ['modal'],
    });
    this.message = message;
    this.autoClose = autoClose;
    this.createView();
  }

  protected handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  protected handleOutsideClick = (event: MouseEvent): void => {
    if (event.target === this.modal.getCreatedElement()) {
      this.close();
    }
  };

  protected close(): void {
    document.body.classList.remove('fixed');
    const overlay: HTMLElement = this.modal.getCreatedElement();
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }

  private createView(): void {
    const modalWindow: BaseElementCreator<'div'> = new BaseElementCreator<'div'>({
      tagName: 'div',
      classNames: ['modal-window'],
    });
    this.modal.addInnerElement(modalWindow.getCreatedElement());

    const closeButton: BaseElementCreator<'span'> = new BaseElementCreator({
      tagName: 'span',
      classNames: ['modal-close'],
      textContent: '×',
    });
    modalWindow.addInnerElement(closeButton.getCreatedElement());

    const message: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['modal-message'],
      textContent: this.message,
    });
    modalWindow.addInnerElement(message.getCreatedElement());
    document.body.classList.add('fixed');

    closeButton.setCallback(() => this.close());

    const overlay: HTMLDialogElement = this.modal.getCreatedElement();
    document.body.appendChild(overlay);
    overlay.showModal();

    document.addEventListener('keydown', this.handleEscape);
    overlay.addEventListener('click', this.handleOutsideClick);

    if (this.autoClose) {
      setTimeout(() => this.close(), 10000);
    }
  }
}
