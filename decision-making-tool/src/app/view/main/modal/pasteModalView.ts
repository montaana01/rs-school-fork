import ModalWindow from './modalView';
import HtmlElementCreator from '../../../services/htmlElementCreator';
import ButtonView from '../../basicElements/buttonView';
import type { SettingsType } from '../../../types/SettingsType.ts';
import StorageManager from '../../../services/storageManager';
import type { OptionsListItemsType } from '../../../types/OptionsListItemsType';
import { HtmlTextAreaElementCreator } from '../../../services/htmlTextareaElementCreator.ts';

export default class PasteModalWindow extends ModalWindow {
  private textarea!: HtmlTextAreaElementCreator;
  private confirmButton!: ButtonView;
  private cancelButton!: ButtonView;
  private storageManager: StorageManager = StorageManager.getInstance();
  private readonly addOptionsCallback: (newOptions: OptionsListItemsType[]) => void;

  constructor(addOptionsCallback: (newOptions: OptionsListItemsType[]) => void) {
    super('', false);
    this.addOptionsCallback = addOptionsCallback;
    this.configurePasteView();
  }

  public waitForClose(): Promise<void> {
    return new Promise((resolve) => {
      this.onClose = resolve;
    });
  }

  protected onClose: () => void = () => {
    this.close();
  };

  private configurePasteView(): void {
    const overlay: HtmlElementCreator = this.elementCreator;
    overlay.removeInnerElements();

    const container: HtmlElementCreator = new HtmlElementCreator(this.modalSettings);
    const closeButton: HtmlElementCreator = new HtmlElementCreator(this.closeButtonSettings);
    closeButton.setCallback(() => this.close());
    container.addInnerHtmlCreatorElement(closeButton);

    const textareaSettings: SettingsType = {
      tagName: 'textarea',
      classNames: ['main__wrapper-modal-textarea'],
      placeholder: 'Paste text in CSV-like format, like:\n title,1',
      rows: 8,
      cols: 34,
      wrap: true,
    };
    this.textarea = new HtmlTextAreaElementCreator(textareaSettings);
    container.addInnerHtmlCreatorElement(this.textarea);

    this.confirmButton = new ButtonView(
      'Confirm',
      () => {
        this.handleConfirm();
      },
      ['main__wrapper-modal-button', 'confirm'],
    );
    container.addInnerHtmlElement(this.confirmButton.getHTMLElement());

    this.cancelButton = new ButtonView(
      'Cancel',
      () => {
        this.close();
      },
      ['main__wrapper-modal-button', 'cancel'],
    );
    container.addInnerHtmlElement(this.cancelButton.getHTMLElement());
    overlay.addInnerHtmlCreatorElement(container);
  }

  private handleConfirm(): void {
    const pastedText: string = this.textarea.element.value.trim();
    if (!pastedText) return;

    const delimiter: string = pastedText.includes(';') ? ';' : pastedText.includes('\t') ? '\t' : ',';
    const lines: string[] = pastedText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    const parsedOptions: OptionsListItemsType[] = lines.map((line, index) => {
      const [title, weight] = line.split(delimiter).map((part) => part.trim());
      return { id: index, title, weight: weight ? Number(weight) : 1 };
    });

    this.addOptionsCallback(parsedOptions);

    this.storageManager.save('pasted', JSON.stringify(parsedOptions));

    this.close();
  }
}
