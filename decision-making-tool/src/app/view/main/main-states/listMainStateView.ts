import View from './../../view';
import HtmlElementCreator from './../../../services/htmlElementCreator';
import { HtmlInputElementCreator } from '../../../services/htmlInputElementCreator';
import type { SettingsType } from './../../../types/SettingsType';
import type { OptionsListItemsType } from '../../../types/OptionsListItemsType';
import ButtonView from './../../basicElements/buttonView';
import StorageManager from './../../../services/storageManager';
import ModalWindow from '../modal/modalView';

export default class ListMainStateView extends View {
  private options: OptionsListItemsType[] = [];
  private readonly optionsContainer: HtmlElementCreator;
  private elementToClear: HTMLElement = HTMLElement;
  private idCounter: number = 0;
  private storageManager: StorageManager = StorageManager.getInstance();
  private readonly storageKey: string = 'options';
  private readonly buttonsContainerSettings: SettingsType;
  private readonly listRowSettings: SettingsType;

  constructor() {
    const mainWrapperSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper'],
    };

    super(mainWrapperSettings);

    const optionsContainerSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper-item', 'main__wrapper-item__options'],
    };
    this.optionsContainer = new HtmlElementCreator(optionsContainerSettings);

    this.buttonsContainerSettings = {
      tagName: 'div',
      classNames: ['main__wrapper-item', 'main__wrapper-item__buttons'],
    };
    this.listRowSettings = {
      tagName: 'div',
      classNames: ['main__wrapper-item__options-row'],
    };

    this.loadOptions();
    this.configureView();
  }

  private loadOptions(): void {
    const stored: OptionsListItemsType[] | null = this.storageManager.load<OptionsListItemsType[]>(this.storageKey);
    if (stored && stored.length > 0) {
      this.options = stored;
      const maxId: number = Math.max(...this.options.map((o) => o.id));
      this.idCounter = maxId + 1;
    } else {
      this.options = [{ id: 1, title: '', weight: 0 }];
      this.idCounter = 2;
    }
  }

  private saveOptions(): void {
    this.storageManager.save(this.storageKey, this.options);
  }

  private clearContainer(elementCreator: HtmlElementCreator): void {
    this.elementToClear = elementCreator.getCreatedElement();
    while (this.elementToClear.firstChild) {
      this.elementToClear.removeChild(this.elementToClear.firstChild);
    }
  }

  private configureView(): void {
    const rootElement: HTMLElement = this.elementCreator.getCreatedElement();
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }

    const titleSettings: SettingsType = {
      tagName: 'h2',
      classNames: ['main__wrapper-item', 'main__wrapper-item__title'],
      textContent: 'List of Options Page',
    };
    this.elementCreator.addInnerHtmlCreatorElement(new HtmlElementCreator(titleSettings));

    this.clearContainer(this.optionsContainer);
    this.options.forEach((option: OptionsListItemsType, index: number) => {
      const row: HTMLElement = this.createOptionRow(option, index);
      this.optionsContainer.addInnerHtmlElement(row);
    });
    this.elementCreator.addInnerHtmlCreatorElement(this.optionsContainer);

    this.elementCreator.addInnerHtmlCreatorElement(this.getButtonsContainerView());
  }

  private getButtonsContainerView(): HtmlElementCreator {
    const buttonsPanelView: HtmlElementCreator = new HtmlElementCreator(this.buttonsContainerSettings);

    const addOptionButtonView: ButtonView = new ButtonView('Add Option', () => this.addOption());
    buttonsPanelView.addInnerHtmlElement(addOptionButtonView.getHTMLElement());

    const clearListButtonView: ButtonView = new ButtonView('Clear List', () => this.clearList(), ['clear']);
    buttonsPanelView.addInnerHtmlElement(clearListButtonView.getHTMLElement());

    const startButtonView: ButtonView = new ButtonView('Start', () => this.startDecision(), ['start']);
    buttonsPanelView.addInnerHtmlElement(startButtonView.getHTMLElement());

    const pasteListButtonView: ButtonView = new ButtonView(
      'Paste List',
      () => new ModalWindow('This part is not realised'),
    );
    // todo: open modal when clicked in paste button
    // const pasteListButtonView: ButtonView = new ButtonView('Paste List', () => this.pasteList());
    buttonsPanelView.addInnerHtmlElement(pasteListButtonView.getHTMLElement());

    const saveJSONButtonView: ButtonView = new ButtonView(
      'Save to JSON',
      () => new ModalWindow('This part is not realised'),
    );
    //todo: implement this function
    // const saveJSONButtonView: ButtonView = new ButtonView('Save to JSON', () => this.saveListToJSON());
    buttonsPanelView.addInnerHtmlElement(saveJSONButtonView.getHTMLElement());

    const loadJSONButtonView: ButtonView = new ButtonView(
      'Load from JSON',
      () => new ModalWindow('This part is not realised'),
    );
    //todo: implement this function
    //const loadJSONButtonView: ButtonView = new ButtonView('Load List JSON', () => this.loadListFromJSON());
    buttonsPanelView.addInnerHtmlElement(loadJSONButtonView.getHTMLElement());

    this.elementCreator.addInnerHtmlCreatorElement(buttonsPanelView);
    return buttonsPanelView;
  }

  private createOptionRow(option: OptionsListItemsType, index: number): HTMLElement {
    const row: HtmlElementCreator = new HtmlElementCreator(this.listRowSettings);
    const idElementSettings: SettingsType = {
      tagName: 'span',
      classNames: ['main__wrapper-item__options-row-id'],
      textContent: option.id.toString(),
    };
    row.addInnerHtmlCreatorElement(new HtmlElementCreator(idElementSettings));

    const titleInput = this.getOptionRowTitleElement(option.title, index);
    row.addInnerHtmlCreatorElement(titleInput);

    const weightInput = this.getOptionRowWeightElement(option.weight, index);
    row.addInnerHtmlCreatorElement(weightInput);

    const deleteButton: ButtonView = new ButtonView(
      'Delete',
      () => {
        this.deleteOption(index);
      },
      ['delete'],
    );
    row.addInnerHtmlElement(deleteButton.getHTMLElement());
    return row.getCreatedElement();
  }

  private deleteOption(index: number): void {
    this.options.splice(index, 1);
    if (this.options.length === 0) {
      this.idCounter = 1;
    }
    this.saveOptions();
    this.configureView();
  }

  private addOption(): void {
    if (this.options.length === 0) {
      this.idCounter = 1;
    }
    const newOption: OptionsListItemsType = { id: this.idCounter, title: '', weight: 0 };
    this.options.push(newOption);
    this.idCounter += 1;
    this.saveOptions();
    this.configureView();
  }

  //todo: implement this function
  //private pasteList(): void{}

  private clearList(): void {
    this.options = [];
    this.idCounter = 1;
    this.saveOptions();
    this.configureView();
  }

  //todo: implement this function
  //private saveListToJSON(): void {}

  //todo: implement this function
  //private loadListFromJSON(): void {}

  private startDecision(): void {
    const validOptions: OptionsListItemsType[] = this.options.filter(
      (option) => option.title.trim() !== '' && option.weight > 0,
    );
    if (validOptions.length < 2) {
      new ModalWindow('Add at least 2 valid options before choosing a solution!');
      return;
    }
    window.location.hash = '#/decision';
  }

  private getOptionRowTitleElement(title: string, index: number): HtmlInputElementCreator {
    const titleInputSettings: SettingsType = {
      tagName: 'input',
      classNames: ['main__wrapper-item__options-row-title'],
      value: title,
      placeholder: 'Option title',
    };
    const titleInput: HtmlInputElementCreator = new HtmlInputElementCreator(titleInputSettings);
    titleInput.getCreatedElement().addEventListener('input', (event: Event) => {
      const target: EventTarget | null = event.target;
      if (target instanceof HTMLInputElement) {
        this.options[index].title = target.value;
        this.saveOptions();
      }
    });
    return titleInput;
  }

  private getOptionRowWeightElement(weight: number, index: number): HtmlInputElementCreator {
    const weightInputSettings: SettingsType = {
      tagName: 'input',
      classNames: ['option-weight'],
      value: weight ? weight.toString() : '',
      placeholder: 'Weight',
      type: 'number',
    };
    const weightInput: HtmlInputElementCreator = new HtmlInputElementCreator(weightInputSettings);
    weightInput.getCreatedElement().addEventListener('input', (event: Event) => {
      const target: EventTarget | null = event.target;
      if (target instanceof HTMLInputElement) {
        this.options[index].weight = Number(target.value);
        this.saveOptions();
      }
    });
    return weightInput;
  }
}
