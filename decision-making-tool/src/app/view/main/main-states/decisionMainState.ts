import View from './../../view';
import HtmlElementCreator from './../../../services/htmlElementCreator';
import { HtmlInputElementCreator } from '../../../services/htmlInputElementCreator';
import type { SettingsType } from '../../../types/SettingsType';
import ButtonView from './../../basicElements/buttonView';
import StorageManager from '../../../services/storageManager';
import ModalWindow from '../modal/modalView';
import SoundManager from '../../../services/soundManager.ts';
import type { OptionsListItemsType } from '../../../types/OptionsListItemsType';

export default class DecisionMainStateView extends View {
  private storageManager: StorageManager = StorageManager.getInstance();
  private soundManager: SoundManager = SoundManager.getInstance();
  private soundButtonView: HTMLElement = HTMLElement;
  private backButtonView: HTMLElement = HTMLElement;
  private pickButtonView: HTMLElement = HTMLElement;
  private readonly durationSettings: SettingsType;
  private readonly durationInputView: HtmlInputElementCreator;
  private canvasElement: HTMLElement = HTMLElement;
  private storageKey: string = 'options';
  private decisionState: string;

  constructor() {
    const mainWrapperSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper'],
    };
    super(mainWrapperSettings);

    this.storageManager.save('page', 'decision');
    this.durationSettings = {
      tagName: 'input',
      classNames: ['main__wrapper-item__controls-input'],
      placeholder: 'Duration (sec)',
      type: 'number',
    };
    this.durationInputView = new HtmlInputElementCreator(this.durationSettings);

    this.decisionState = 'initial';
    this.storageManager.save('pageState', this.decisionState);

    this.checkValidOptions();
    this.configureView();
  }

  private checkValidOptions(): void {
    const decisionData: OptionsListItemsType[] = this.storageManager.load(this.storageKey) || [];
    if (decisionData.length < 2) {
      window.location.hash = '#/list';
    }
  }

  private configureView(): void {
    const rootElement: HTMLElement = this.elementCreator.getCreatedElement();
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }

    const titleSettings: SettingsType = {
      tagName: 'h2',
      classNames: ['main__wrapper-item__subtitle'],
      textContent: 'Decision Picker Page',
    };
    this.elementCreator.addInnerHtmlCreatorElement(new HtmlElementCreator(titleSettings));

    this.elementCreator.addInnerHtmlCreatorElement(this.getControlPanelView());

    this.elementCreator.addInnerHtmlCreatorElement(this.getCanvasElementView());
  }

  private toggleControls(disabled: boolean): void {
    const controls: HTMLElement[] = [
      this.backButtonView,
      this.soundButtonView,
      this.durationInputView.element,
      this.pickButtonView,
    ];

    controls.forEach((control) => {
      if (control) {
        control.tabIndex = disabled ? -1 : 0;
        control.classList.toggle('disabled', disabled);
      }
    });
  }

  private getControlPanelView(): HtmlElementCreator {
    const controlPanelSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper-item', 'main__wrapper-item__controls'],
    };
    const controlPanel: HtmlElementCreator = new HtmlElementCreator(controlPanelSettings);
    const backButton: ButtonView = new ButtonView(
      'Back',
      (): void => {
        window.location.hash = '#/list';
      },
      ['main__wrapper-item__controls-back'],
    );
    this.backButtonView = backButton.getHTMLElement();
    controlPanel.addInnerHtmlElement(this.backButtonView);
    const soundButtonView: ButtonView = new ButtonView('🔊', () => {}, ['main__wrapper-item__controls-sound']);
    this.soundButtonView = soundButtonView.getHTMLElement();
    controlPanel.addInnerHtmlElement(this.soundButtonView);
    this.soundManager.initializeSound(this.soundButtonView);

    controlPanel.addInnerHtmlElement(this.durationInputView.getCreatedElement());

    const pickButtonView: ButtonView = new ButtonView(
      'Pick',
      (): void => {
        this.startPickingProcess();
      },
      ['main__wrapper-item__controls-pick'],
    );
    this.pickButtonView = pickButton.getHTMLElement();
    controlPanel.addInnerHtmlElement(this.pickButtonView);

    const pickedOptionSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper-item__controls-subtitle'],
      textContent: 'Please set up the picking process.',
    };
    controlPanel.addInnerHtmlCreatorElement(new HtmlElementCreator(pickedOptionSettings));
    return controlPanel;
  }

  private startPickingProcess(): void {
    this.decisionState = 'picking';
    this.storageManager.save('pageState', this.decisionState);
    this.toggleControls(true);

    // todo: write disable and enable controls function
    //this.disableControls();

    this.duration = Number(this.durationInputView.element.value);
    if (!this.duration || this.duration < 5) new ModalWindow('Please enter duration >5 secs!');
    // todo: write choosing process
    const decisionData: OptionsListItemsType[] | null = this.storageManager.load(this.storageKey);
    if (!Array.isArray(decisionData) || decisionData.length === 0) {
      new ModalWindow("We don't have any information in localStorage");
      return;
    }
    const dataText: string = decisionData
      .map((item: OptionsListItemsType) => `ID: ${item.id}, Title: "${item.title}", Weight: ${item.weight}`)
      .join('');

    new ModalWindow(`This part of task is not realised! Duration ${this.duration} s 
      And ${this.storageKey} = ${dataText}
    `);
  }

  private getCanvasElementView(): HtmlElementCreator {
    const canvasSettings: SettingsType = {
      tagName: 'canvas',
      classNames: ['main__wrapper-item', 'main__wrapper-item__canvas'],
    };
    const canvasElementView: HtmlElementCreator = new HtmlElementCreator(canvasSettings);

    // todo: implement creating canvas element that consist of stored data from list of options view
    this.canvasElement = canvasElementView.getCreatedElement();
    this.canvasElement.setAttribute('height', '100');
    return canvasElementView;
  }
}
